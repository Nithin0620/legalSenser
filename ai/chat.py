# chat_with_doc.py
from transformers import pipeline

# Initialize model only once (keep lightweight for Hugging Face Space)
qa_model_name = "google/flan-t5-large"
qa_pipe = pipeline("text2text-generation", model=qa_model_name)

def chat_with_doc(context: str, current_question: str, previous_questions: list = None):
    """
    Handles contextual Q&A over a legal document.

    Args:
        context (str): Full document text.
        current_question (str): Latest user question.
        previous_questions (list): List of dicts [{user: "...", response: "..."}].

    Returns:
        str: Concise AI-generated answer (string only).
    """

    # Build readable conversation history
    conversation_log = ""
    if previous_questions and isinstance(previous_questions, list):
        formatted_history = []
        for turn in previous_questions[-5:]:  # limit to last 5 exchanges
            user_q = turn.get("user", "").strip()
            ai_a = turn.get("response", "").strip()
            if user_q and ai_a:
                formatted_history.append(f"User: {user_q}\nAssistant: {ai_a}")
        conversation_log = "\n\n".join(formatted_history)
    else:
        conversation_log = "No prior conversation history."

    # Construct better prompt
    prompt = f"""
    You are a professional, concise, and trustworthy **legal assistant** helping users interpret documents.

    📄 **Document Context:**
    {context[:5000]}

    💬 **Conversation History:**
    {conversation_log}

    ❓ **Current Question:**
    {current_question}

    🎯 **Your Task:**
    Answer the user's latest question *strictly based on the document and conversation history*.

    Rules:
    1. Begin with a **direct answer** (1–2 lines).
    2. Optionally follow with a **short, clear explanation (1–2 lines)**.
    3. If the document doesn’t provide enough detail, respond with:
    → "The document does not specify this information."
    4. Avoid greetings, disclaimers, or repetition.

    Now, provide your answer below:
    """

    # Run the model
    output = qa_pipe(prompt, max_length=512, do_sample=False)[0]['generated_text']
    return output.strip()
