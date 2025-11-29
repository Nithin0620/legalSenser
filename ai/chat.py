# chat.py
"""
Document Q&A Chat Module using Groq API
Conversational question-answering with document context and memory.
"""
from groq_helper import call_groq_api, CHAT_SYSTEM_PROMPT
from typing import Dict, List

def chat_with_doc(context: str, question: str, history: List[Dict] = None) -> str:
    """
    Answer questions based on document context with conversation memory using Groq API.
    
    Args:
        context: Full document text
        question: User's question
        history: List of previous Q&A pairs [{"question": "...", "answer": "..."}, ...]
        
    Returns:
        str: Answer to the question (plain text, not wrapped in JSON)
    """
    # Limit context to avoid token limits
    limited_context = context[:8000] if len(context) > 8000 else context
    
    # Build conversation history for context
    history_context = ""
    if history and isinstance(history, list) and len(history) > 0:
        history_lines = []
        for h in history[-5:]:  # Last 5 exchanges for better context
            q = h.get('question', '')
            a = h.get('answer', '')
            if q and a:
                history_lines.append(f"Previous Q: {q}\nPrevious A: {a}")
        if history_lines:
            history_context = "\n\nPREVIOUS CONVERSATION:\n" + "\n\n".join(history_lines) + "\n"
    
    # Build comprehensive user prompt
    user_prompt = f"""Answer the following question based on the provided legal document. Be direct, accurate, and concise.

DOCUMENT TEXT:
{limited_context}
{history_context}

CURRENT QUESTION: {question}

Provide a clear, specific answer based only on the information in the document. If the answer isn't in the document, say so. Use plain language and be helpful."""
    
    # Call Groq API (no JSON format for conversational response)
    response = call_groq_api(
        api_name="chat",
        system_prompt=CHAT_SYSTEM_PROMPT,
        user_prompt=user_prompt,
        response_format=None,  # Plain text response
        temperature=0.4,
        max_tokens=500
    )
    
    # Handle errors
    if "error" in response:
        return f"I encountered an error processing your question: {response['error']}"
    
    # Extract answer text
    answer = response.get("response", "I couldn't generate an answer. Please try rephrasing your question.")
    
    # Clean up answer
    if not answer or len(answer.strip()) < 3:
        return "I couldn't find enough information in the document to answer that question."
    
    # Remove any repetition of the question
    if question.lower() in answer.lower()[:len(question)+20]:
        answer = answer[len(question):].strip(":- ")
    
    return answer.strip()
