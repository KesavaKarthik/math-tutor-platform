import os
from typing import List

# LangChain imports
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_classic.agents import AgentExecutor, create_openai_functions_agent

from langchain_core.tools import Tool

# Local imports
from core.config import settings
from services.tools import calculator_tool, sympy_tool, plot_tool, unit_convert_tool

# Initialize the LLM (Gemini via LangChain wrapper)
llm = ChatGoogleGenerativeAI(model="gemini-3-flash-preview", temperature=0.0, api_key=settings.GEMINI_API_KEY)

# Register the tools the agent can use
TOOLS: List[Tool] = [
    calculator_tool,   # safe arithmetic with numexpr
    sympy_tool,       # symbolic math (solve, simplify, integrate)
    plot_tool,        # generate Matplotlib PNGs and return file URLs
    unit_convert_tool # unit conversion via pint
]

# Create a LangChain agent that can call the tools (OpenAI‑function style)
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder

# Define a simple prompt that includes the agent scratchpad for tool usage
agent_prompt = ChatPromptTemplate.from_messages([
    ("system", "You are a helpful AI Math Tutor. Use the provided tools when necessary."),
    ("human", "{input}"),
    MessagesPlaceholder(variable_name="agent_scratchpad"),
])

# Create the OpenAI Functions style agent with the prompt
agent = create_openai_functions_agent(llm, TOOLS, agent_prompt)

# Wrap in an AgentExecutor to run the agent
agent_executor = AgentExecutor(agent=agent, tools=TOOLS, verbose=False)

def format_history(messages: List[dict]) -> str:
    """Convert a list of message dicts to a simple "Student: …" / "Tutor: …" format.
    The sliding‑window already limits the list to the last 6 entries.
    """
    formatted = ""
    for msg in messages:
        role = "Student" if msg["role"] == "user" else "Tutor"
        formatted += f"{role}: {msg['content']}\n"
    return formatted

def _run_agent(prompt: str) -> str:
    """Run the LangChain agent and return the final answer string.
    The agent may invoke any of the registered tools.
    """
    result = agent_executor.invoke({"input": prompt})
    output = result.get("output", result)
    
    if isinstance(output, list):
        text_pieces = []
        for item in output:
            if isinstance(item, dict) and "text" in item:
                text_pieces.append(item["text"])
            elif isinstance(item, str):
                text_pieces.append(item)
            else:
                text_pieces.append(str(item))
        return "".join(text_pieces)
        
    return str(output)

def ask_learning_mode(question: str, concept_text: str, history: List[dict]) -> str:
    hist_text = format_history(history)
    prompt = f"""
You are an AI Math Tutor. The student is currently studying this specific mathematical concept:
---
{concept_text}
---
Previous conversation:
{hist_text}

The student just asked: \"{question}\"

Answer the student's question clearly. KEEP YOUR RESPONSE EXTREMELY CRISP AND SHORT. Do not write long paragraphs or over‑explain. If they ask something unrelated to math, politely steer them back. Use Markdown and LaTeX ($$ $$ or $ $) for math.
"""
    return _run_agent(prompt)

def ask_socratic_mode(question: str, example_question: str, example_solution: str, history: List[dict]) -> str:
    hist_text = format_history(history)
    prompt = f"""
You are a strictly Socratic AI Math Tutor.
The student is working on solving this problem:
---
{example_question}
---
The ACTUAL solution is:
---
{example_solution}
---
CRITICAL RULE: DO NOT GIVE THE STUDENT THE FINAL ANSWER OR FULL SOLUTION!
Your job is to guide them step‑by‑step. If they are stuck, give them a tiny hint.
If they gave an answer, check if it matches the actual solution steps.

Previous conversation:
{hist_text}

The student just said: \"{question}\"

Respond like a tutor. KEEP YOUR RESPONSE EXTREMELY CRISP AND SHORT. Give only one small hint or prompt at a time. Do not write long paragraphs.
"""
    return _run_agent(prompt)

def ask_global_mode(question: str, retrieved_context: str, history: List[dict]) -> str:
    hist_text = format_history(history)
    prompt = f"""
You are a general AI Math Tutor.
Here is some relevant context retrieved from the textbook:
---
{retrieved_context}
---

Previous conversation:
{hist_text}

The student just asked: \"{question}\"

Answer their question intelligently using the textbook context if it is helpful. KEEP YOUR RESPONSE EXTREMELY CRISP, DIRECT, AND SHORT. Avoid long, overwhelming paragraphs. Be straight to the point.
"""
    return _run_agent(prompt)
