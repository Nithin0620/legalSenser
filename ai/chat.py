# chat.py
"""
Document Q&A Chat Module
Conversational question-answering with document context and memory.
"""
from transformers import pipeline
from typing import Dict, List
import re
import json

# Upgraded AI model for REAL conversational + contextual + legal reasoning
QA_MODEL = "meta-llama/Llama-3.1-8B-Instruct"
_qa_pipe = None

def _get_qa_pipeline():
    """Lazy load the Q&A pipeline."""
    global _qa_pipe
    if _qa_pipe is None:
        _qa_pipe = pipeline(
            "text-generation",
            model=QA_MODEL,
            torch_dtype="auto",
            device_map="auto",
            truncation=True
        )
    return _qa_pipe

def chat_with_doc(context: str, question: str, history: List[Dict] = None) -> str:
    """
    Answer questions based on document context with conversation memory.
    Entire answer must be generated using AI reasoning.
    """
    pipe = _get_qa_pipeline()

    # Increase allowed context for better answers
    limited_context = context[:3000] if len(context) > 3000 else context

    # Build AI-readable memory
    history_context = ""
    if history and isinstance(history, list):
        history_lines = []
        for h in history[-4:]:  # last 4 exchanges for more memory
            q = h.get("question","")
            a = h.get("answer","")
            if q and a:
                history_lines.append(f"Q: {q}\nA: {a}")
        if history_lines:
            history_context = "Chat Memory:\n" + "\n\n".join(history_lines) + "\n\n"

    # AI unified legal prompt
    prompt = f"""
You are a legal document Q&A assistant.

Instructions:
- Answer using ONLY the document provided
- Use chat memory to maintain conversational continuity
- Don't give generic answers
- Be precise, clear, professional and helpful

{history_context}

Document content:
{limited_context}

User Question: {question}

Answer concisely:
"""

    try:
        result = pipe(prompt, max_new_tokens=180, do_sample=False, temperature=0.2)
        answer = result[0]["generated_text"].strip()

        if not answer or len(answer) < 3:
            return "I couldn't locate enough details in the document to answer that accurately."

        # Remove repeated question echoes
        if question.lower() in answer.lower()[:len(question)+8]:
            answer = answer[len(question):].strip(":- ")

        return answer.strip()

    except Exception as e:
        return "I ran into a processing issue. Try rephrasing your question."
