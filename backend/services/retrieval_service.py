import os
import google.generativeai as genai
from core.database import get_content_db_connection
from services.router_service import route_query, QueryIntent
from core.config import settings

def rrf_score(rank_semantic, rank_keyword, k=60):
    score = 0.0
    if rank_semantic > 0:
        score += 1.0 / (k + rank_semantic)
    if rank_keyword > 0:
        score += 1.0 / (k + rank_keyword)
    return score

def handle_exact(intent: QueryIntent, conn, session_context: dict = None) -> str:
    """Deterministic exact lookup for examples."""
    sql = """
        SELECT ce.title, ce.question_text, ce.solution_text 
        FROM chapter_examples ce
        LEFT JOIN chapters c ON ce.chapter_id = c.id
        WHERE 1=1
    """
    params = {}
    
    context_chapter_id = session_context.get("chapter_id") if session_context else None
    
    if context_chapter_id:
        sql += " AND ce.chapter_id = :cid"
        params["cid"] = context_chapter_id
    elif getattr(intent, "chapter_name", None):
        sql += " AND c.chapter_name ILIKE :cname"
        params["cname"] = f"%{intent.chapter_name}%"
    else:
        # If no chapter info is provided, we can't reliably exact-match across chapters
        return "No exact example found matching those details (missing chapter info)."
        
    if intent.example_number:
        sql += " AND ce.example_number = :enum"
        params["enum"] = str(intent.example_number)
        
    rows = conn.run(sql, **params)
    
    if not rows:
        return "No exact example found matching those details."
        
    context = ""
    for row in rows:
        title, q, s = row
        context += f"[WORKED EXAMPLE: {title}]\nQuestion:\n{q}\n\nSolution:\n{s}\n\n"
    return context

def handle_broad(intent: QueryIntent, conn, session_context: dict = None) -> str:
    """Broad hierarchical lookup for chapters/sections."""
    context_chapter_id = session_context.get("chapter_id") if session_context else None
    
    if context_chapter_id:
        sql = "SELECT section_type, content FROM chapter_sections WHERE chapter_id = :cid LIMIT 10"
        rows = conn.run(sql, cid=context_chapter_id)
        if not rows:
            # Fallback to chapter name
            ch = conn.run("SELECT chapter_name FROM chapters WHERE id = :cid", cid=context_chapter_id)
            return f"[CHAPTER {context_chapter_id} CONTEXT]\nTitle: {ch[0][0] if ch else 'Unknown'}\nNo detailed section summaries available."
            
        context = f"[CHAPTER {context_chapter_id} SECTIONS]\n"
        for row in rows:
            stype, content = row
            context += f"--- Section: {stype} ---\n{content}\n\n"
        return context
    return "Broad query received, but no specific chapter was identified in the context."

def handle_hybrid(query: str, intent: QueryIntent, conn, limit: int = 5, session_context: dict = None) -> str:
    """Advanced Metadata-Filtered Hybrid Search with Reciprocal Rank Fusion (RRF)."""
    genai.configure(api_key=settings.GEMINI_API_KEY)
    
    # Generate Embedding
    result = genai.embed_content(
        model="models/gemini-embedding-2",
        content=query,
        task_type="retrieval_query",
        output_dimensionality=768
    )
    query_embedding = result['embedding']
    
    # Build filter clauses
    where_clause = ""
    params = {"emb": str(query_embedding), "q": query}
    
    context_chapter_id = session_context.get("chapter_id") if session_context else None
    
    if context_chapter_id:
        where_clause += " AND chapter_id = :cid"
        params["cid"] = context_chapter_id
        
    # We will search Concepts, Examples, or BOTH based on intent
    search_concepts = intent.intent in ["CONCEPT", "BOTH"]
    search_examples = intent.intent in ["EXAMPLE", "BOTH"]
    
    # 1. Semantic Search
    semantic_sql = ""
    parts = []
    if search_concepts:
        parts.append(f"SELECT id, 'concept' as type, title, content, chapter_id, content_embedding <=> CAST(:emb AS vector) as dist FROM chapter_concepts WHERE content_embedding IS NOT NULL {where_clause}")
    if search_examples:
        parts.append(f"SELECT id, 'example' as type, title, question_text || '\n\nSolution: ' || solution_text as content, chapter_id, content_embedding <=> CAST(:emb AS vector) as dist FROM chapter_examples WHERE content_embedding IS NOT NULL {where_clause}")
    
    semantic_sql = " UNION ALL ".join(parts) + " ORDER BY dist ASC LIMIT 20"
    
    semantic_results = []
    if parts:
        try:
            semantic_results = conn.run(semantic_sql, **params)
        except Exception as e:
            print("Semantic search failed:", e)

    # 2. Keyword Search (FTS)
    keyword_sql = ""
    parts_fts = []
    if search_concepts:
        parts_fts.append(f"SELECT id, 'concept' as type, title, content, chapter_id, ts_rank(to_tsvector('english', title || ' ' || content), plainto_tsquery('english', :q)) as rank FROM chapter_concepts WHERE 1=1 {where_clause}")
    if search_examples:
        parts_fts.append(f"SELECT id, 'example' as type, title, question_text || '\n\nSolution: ' || solution_text as content, chapter_id, ts_rank(to_tsvector('english', title || ' ' || question_text || ' ' || solution_text), plainto_tsquery('english', :q)) as rank FROM chapter_examples WHERE 1=1 {where_clause}")
        
    keyword_sql = " UNION ALL ".join(parts_fts) + " ORDER BY rank DESC LIMIT 20"
    
    keyword_results = []
    if parts_fts:
        try:
            keyword_results = conn.run(keyword_sql, **params)
        except Exception as e:
            print("Keyword search failed:", e)
            
    # 3. Apply Reciprocal Rank Fusion (RRF)
    # Map item unique key (type_id) to its ranks
    items = {} # key: (type, id) -> {'data': row, 'sem_rank': 0, 'kw_rank': 0}
    
    for rank, row in enumerate(semantic_results, start=1):
        uid = (row[1], row[0])
        items[uid] = {'data': row, 'sem_rank': rank, 'kw_rank': 0}
        
    for rank, row in enumerate(keyword_results, start=1):
        uid = (row[1], row[0])
        if uid not in items:
            items[uid] = {'data': row, 'sem_rank': 0, 'kw_rank': rank}
        else:
            items[uid]['kw_rank'] = rank
            
    # Calculate RRF score
    scored_items = []
    for uid, info in items.items():
        score = rrf_score(info['sem_rank'], info['kw_rank'])
        scored_items.append((score, info['data']))
        
    # Sort by RRF score descending
    scored_items.sort(key=lambda x: x[0], reverse=True)
    top_items = scored_items[:limit]
    
    # 4. Context Assembly
    if not top_items:
        return "No relevant mathematical content found for this query."
        
    context_str = ""
    for score, row in top_items:
        item_id, item_type, title, content, cid, _ = row
        if item_type == 'concept':
            context_str += f"[MATHEMATICAL CONCEPT: {title}]\nContent:\n{content}\n\n"
        else:
            context_str += f"[WORKED EXAMPLE: {title}]\n{content}\n\n"
            
    return context_str

def get_tutor_context(query: str, session_context: dict = None, limit: int = 5, history: list = None) -> str:
    """
    Main entry point for the backend.
    Routes the query, executes the appropriate retrieval strategy, and returns structured context.
    """
    print(f"Routing query: '{query}'...")
    try:
        intent = route_query(query, session_context, history)
    except Exception as e:
        print(f"Error in route_query: {e}")
        return f"[SYSTEM NOTIFICATION: The Retrieval LLM failed due to an API error or rate limit ({e}). You could not search the database for this specific problem. Please apologize to the user and ask them to wait a moment before trying again.]"
        
    print(f"Detected Intent: {intent}")
    
    standalone_query = intent.standalone_query if getattr(intent, 'standalone_query', None) else query
    print(f"Using standalone query: '{standalone_query}'")
    
    conn = get_content_db_connection()
    try:
        if intent.intent == "EXACT":
            exact_result = handle_exact(intent, conn, session_context)
            if "No exact example found" not in exact_result:
                return exact_result
            print("Exact match failed, falling back to hybrid search.")
            return handle_hybrid(standalone_query, intent, conn, limit, session_context)
        elif intent.intent == "BROAD":
            return handle_broad(intent, conn, session_context)
        else:
            return handle_hybrid(standalone_query, intent, conn, limit, session_context)
    finally:
        conn.close()


