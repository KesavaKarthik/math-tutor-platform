# Math Tutor Platform

An AI tutoring platform for ICSE Class 10 mathematics, built around a simple idea: a tutor
that hands over the answer isn't teaching. The system ingests a real textbook into Postgres,
retrieves the right passage for a question using hybrid search, and then reasons over it in
one of three pedagogically distinct modes — including a Socratic mode that holds the worked
solution in its own context but is structurally prevented from showing it to the student.

**Stack:** React 19 + TypeScript + Vite · FastAPI · PostgreSQL + pgvector · Gemini via LangChain

---

## The three modes

| Mode | Context the model sees | Behaviour |
|---|---|---|
| **Learning** | The exact textbook section the student is reading | Answers questions about that one concept, and steers off-topic questions back |
| **Socratic** | The problem statement **and** its full worked solution | Never reveals the answer — checks the student's work and gives one small hint at a time |
| **Global** | Whatever hybrid retrieval pulls from the whole textbook | Open-ended tutoring across every chapter |

The Socratic guarantee is enforced in two places, not one. The prompt forbids revealing the
solution, *and* `solution_text` is structurally absent from the API response schema — the
Pydantic `Example` model simply has no such field, and the SQL query never selects it
([`schemas/content_schemas.py`](backend/schemas/content_schemas.py),
[`api/routes_content.py`](backend/api/routes_content.py)). A student who opens DevTools finds
nothing to find. Prompt discipline alone would not survive contact with a curious teenager.

---

## Architecture

```
  React SPA (Vite)                FastAPI                     PostgreSQL
  ----------------                -------                     ----------
  Dashboard                                                   content_db
  ChapterView          ------>    /api/content    ------>       chapters
  LearningMode                                                  chapter_concepts   (+ vector)
  SocraticMode         ------>    /api/chat       --+           chapter_examples   (+ vector)
  GlobalChat                                        |           chapter_sections
  Login / Register     ------>    /api/auth  -----+ |           exercise_questions
                                                  | |
                                                  | |        user_information
                                                  | +------>    users
                                                  |              conversations
                                                  |              messages
                                                  v
                                    +--------------------------+
                                    |  Retrieval pipeline      |
                                    |  router -> search -> RRF |
                                    +------------+-------------+
                                                 v
                                    +--------------------------+
                                    |  LangChain agent         |
                                    |  Gemini + 4 math tools   |
                                    +--------------------------+
```

Two separate databases: `content_db` holds the textbook (read-mostly, vector-indexed),
`user_information` holds accounts and conversation history. They are reached through
independent connection factories in [`core/database.py`](backend/core/database.py).

---

## The retrieval pipeline

The interesting part of this project. A naive RAG system embeds the query, takes the top-k by
cosine distance, and hopes. That fails on the two query shapes students actually use: *"show me
Example 14 from Chapter 5"* (an exact lookup, where semantic similarity is the wrong tool
entirely) and *"what about the second one?"* (a follow-up that means nothing without the
conversation that preceded it).

So retrieval runs in four stages
([`services/retrieval_service.py`](backend/services/retrieval_service.py),
[`services/router_service.py`](backend/services/router_service.py)):

**1 — Route.** A lightweight Gemini call with a JSON response schema classifies the query into
one of `EXACT`, `CONCEPT`, `EXAMPLE`, `BOTH`, or `BROAD`, and extracts any chapter name, section
number, or example number it mentions. The same call also **rewrites the query to be
standalone**, resolving pronouns against the last three exchanges — so *"what about the second
one?"* becomes a self-contained question before it ever reaches the search layer. If the router
fails, retrieval raises rather than silently degrading to a bad search.

**2 — Dispatch by intent.** `EXACT` runs a deterministic parameterised SQL lookup — no
embeddings involved, because you don't need a vector index to find Example 14. `BROAD` walks the
chapter/section hierarchy. Everything else goes to hybrid search. `EXACT` falls back to hybrid
if the deterministic lookup misses.

**3 — Hybrid search with Reciprocal Rank Fusion.** Two independent searches run over the same
metadata-filtered candidate set:

- **Semantic** — a 768-dimensional `gemini-embedding-2` query embedding against pgvector, using
  the `<=>` cosine-distance operator.
- **Lexical** — PostgreSQL full-text search, `ts_rank` over `to_tsvector('english', ...)`.

Their two ranked lists are fused with Reciprocal Rank Fusion, `score = sum of 1/(k + rank)` with
`k = 60`. RRF is used rather than a weighted score blend because cosine distances and `ts_rank`
values live on incomparable scales — fusing *ranks* sidesteps the normalisation problem
entirely, and a document both retrievers like outranks one that only a single retriever loves.
When the student is inside a chapter, `chapter_id` is pushed down into the `WHERE` clause of
both searches, so filtering happens in Postgres rather than by discarding results afterwards.

**4 — Assemble.** Top results are tagged `[MATHEMATICAL CONCEPT: ...]` or
`[WORKED EXAMPLE: ...]` so the generating model can tell definitions from solved problems.

---

## The agent and its tools

Answer generation runs through a LangChain agent
([`services/llm_service.py`](backend/services/llm_service.py)) rather than a bare completion
call, because LLMs are unreliable arithmetic engines. Four tools are registered
([`services/tools.py`](backend/services/tools.py)):

| Tool | Backed by | For |
|---|---|---|
| `calculator` | `numexpr` | Safe arithmetic — no `eval()` on model output |
| `sympy` | `sympy` | Symbolic solve, simplify, integrate |
| `plot` | `matplotlib` | Renders a function to PNG and returns a file URL |
| `unit_convert` | `pint` | Unit conversion |

Each mode composes a different prompt over the same agent, and all three receive a sliding
window of the **last 6 messages** — enough for pronoun resolution and continuity, bounded so
context cost stays flat as a session grows.

---

## Frontend architecture

A layered React SPA, deliberately structured so that pages compose rather than implement:

```
src/
  api/          axios client + one module per resource; JWT injected by interceptor
  types/        auth - chat - content - ui   (barrelled through @/types)
  constants/    routes - api - auth - chat themes - study-mode configs
  hooks/        useChatSession - useConversations - useAsyncData - useStepper - ...
  components/
    ui/         shadcn primitives (button, card, input, scroll-area, spinner)
    layout/     ProtectedRoute - LoadingScreen - EmptyStateScreen - PageShell
    chat/       MessageList - MessageBubble - ChatComposer - EmbeddedChatPanel - sidebar
    feature/    auth - dashboard - chapter - study
  pages/        seven route components — state and wiring only
  store/        zustand auth store, token persisted to localStorage
```

Two decisions carry most of the weight:

**One chat engine, three surfaces.** `useChatSession` owns a conversation — transcript, draft
input, in-flight flag, conversation id — and takes the endpoint as an injected `send` callback.
The full-page tutor chat, the panel docked under Learning Mode, and the one under Socratic Mode
are the same hook with three different transports.

**Theming by configuration, not by branching.** Learning Mode and Socratic Mode are visually
distinct (blue vs. purple, different labels, different placeholder copy) but structurally
identical. Rather than duplicate the components or thread `variant` props through them, each
mode is a single config object — `LEARNING_MODE` / `SOCRATIC_MODE` in
[`constants/studyModes.ts`](frontend/src/constants/studyModes.ts) — holding complete literal
Tailwind class strings. The pages differ only in which object they import. Class strings are
kept literal and never interpolated, so Tailwind's JIT compiler can still see every one of them.

---

## Auth

JWT bearer tokens, bcrypt password hashing, 24-hour expiry. Notable is the **optional-user**
dependency: `get_optional_user` returns `None` for an anonymous request instead of raising, so
the dashboard, chapters and all three tutoring modes work fully without an account. Signing in
adds persistence — conversation history, rename, delete — rather than unlocking the product.
Guests get the tutor; accounts get their tutor remembered.

---

## Running it

**Prerequisites:** Python 3.11+, Node 20+, PostgreSQL 14+ with the
[pgvector](https://github.com/pgvector/pgvector) extension.

### 1. Databases

```bash
createdb content_db
createdb user_information
psql -d content_db -c "CREATE EXTENSION IF NOT EXISTS vector;"
```

### 2. Backend

```bash
cd backend
python -m venv venv
source venv/Scripts/activate     # Windows; use venv/bin/activate on macOS/Linux
pip install -r requirements.txt

cp .env.example .env             # then fill in the values
python scripts/init_chat_db.py   # creates users / conversations / messages

uvicorn main:app --reload        # http://127.0.0.1:8000  (docs at /docs)
```

Configuration is environment-driven ([`core/config.py`](backend/core/config.py)). Secrets have
no defaults — a missing `DB_PASSWORD`, `JWT_SECRET_KEY` or `GEMINI_API_KEY` fails loudly at
startup rather than silently running on a placeholder. Generate a signing key with:

```bash
python -c "import secrets; print(secrets.token_urlsafe(48))"
```

### 3. Frontend

```bash
cd frontend
npm install
npm run dev                      # http://localhost:5173
```

---

## Known gaps

Stated plainly, because a README that only lists strengths isn't much of an engineering
document.

- **No content ingestion pipeline in this repo.** `scripts/init_chat_db.py` creates the user
  tables, but `content_db` — chapters, concepts, examples and their embeddings — was populated
  out-of-band. A fresh clone runs, but against an empty textbook. Committing the ingestion and
  embedding scripts is the single most valuable next change.
- **Schema drift.** `init_chat_db.py` creates `users` without the `class_level` / `board`
  columns that registration writes, and without `conversations.title`. The live schema has
  drifted ahead of the script.
- **No tests.** The retrieval router and the RRF fusion are the two things most worth pinning
  down with tests, and neither has any.
- **`google-generativeai` is deprecated.** The retrieval and routing paths still use the retired
  SDK and should move to `google-genai`.
- **CORS is `allow_origins=["*"]`**, fine for local development and wrong for anything deployed.
