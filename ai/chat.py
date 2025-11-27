# chat.py
"""
Document Q&A Chat Module
Conversational question-answering with document context and memory.
"""
from transformers import pipeline
from typing import Dict, List
import re

# Model: Flan-T5 for better conversational understanding
QA_MODEL = "google/flan-t5-base"
_qa_pipe = None

def _get_qa_pipeline():
    """Lazy load the Q&A pipeline."""
    global _qa_pipe
    if _qa_pipe is None:
        _qa_pipe = pipeline("text2text-generation", model=QA_MODEL)
    return _qa_pipe

def chat_with_doc(context: str, question: str, history: List[Dict] = None) -> str:
    """
    Answer questions based on document context with conversation memory.
    
    Args:
        context: Full document text
        question: User's question
        history: List of previous Q&A pairs [{"question": "...", "answer": "..."}, ...]
        
    Returns:
        str: Answer to the question (plain text, not wrapped in JSON)
    """
    pipe = _get_qa_pipeline()
    
    # Limit context to avoid memory issues
    limited_context = context[:2000] if len(context) > 2000 else context
    
    # Build conversation history
    history_context = ""
    if history and isinstance(history, list) and len(history) > 0:
        history_lines = []
        for h in history[-3:]:  # Last 3 exchanges
            q = h.get('question', '')
            a = h.get('answer', '')
            if q and a:
                history_lines.append(f"Q: {q}\nA: {a}")
        if history_lines:
            history_context = "Previous conversation:\n" + "\n\n".join(history_lines) + "\n\n"
    
    # Create a focused prompt
    prompt = f"""Based on the following document, answer the question directly and concisely.

{history_context}Document:
{limited_context}

Question: {question}

Answer (be specific and direct):"""
    
    try:
        # Use AI model for question answering
        result = pipe(prompt, max_length=200, min_length=10, do_sample=False, temperature=0.3)
        answer = result[0]['generated_text'].strip()
        
        # Clean up answer
        if not answer or len(answer) < 3:
            return "I couldn't find enough information in the document to answer that question."
        
        # Remove any repetition of the question
        if question.lower() in answer.lower()[:len(question)+10]:
            answer = answer[len(question):].strip(":- ")
        
        return answer
        
    except Exception as e:
        return "I encountered an error processing your question. Please try rephrasing it."
