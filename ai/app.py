from fastapi import FastAPI, Form
from ai_legal_simplify import analyze_contract
from compare import compare_docs
from analyze_risk import analyze_risk
from chat import chat_with_doc

app = FastAPI(title="LegalSenser AI Microservice")

# ---------- ROOT ----------
@app.get("/")
def root():
    return {"message": "AI microservice is running 🚀"}


# ---------- SINGLE SIMPLIFY + SUMMARIZE ENDPOINT ----------
@app.post("/simplify")
async def simplify(text: str = Form(...)):
    """
    Combines summarization + simplification into a single unified AI analysis.
    Returns:
    {
      "title": "...",
      "summary": "...",
      "simplifiedPoints": [...]
    }
    """
    result = analyze_contract(text)
    return {"result": result}


# ---------- COMPARE ----------
@app.post("/compare")
def compare(data: dict):
    """
    Compares two documents (old vs new) and highlights added/removed/modified clauses.
    Input: {"doc1": "...", "doc2": "..."}
    """
    return {"result": compare_docs(data["doc1"], data["doc2"])}


# ---------- ANALYZE RISK ----------
@app.post("/analyze-risk")
def analyze(data: dict):
    """
    Performs clause-level risk analysis.
    Input: {"text": "...", "document_type": "pdf|docx|image"} (document_type optional)
    """
    document_text = data["text"]
    document_type = data.get("document_type", "pdf")
    return {"result": analyze_risk(document_text, document_type)}


# ---------- CHAT ----------
@app.post("/chat")
async def chat(req: Request):
    """
    Handles document-based Q&A chat.

    Input:
    {
      "context": "Full document text",
      "current_question": "User's latest question",
      "previous_questions": [
          {"user": "previous question", "response": "previous answer"},
          ...
      ]
    }

    Returns:
      {"answer": "Direct, concise AI-generated answer"}
    """
    try:
        data = await req.json()
        context = data.get("context", "")
        current_question = data.get("current_question", "")
        previous_questions = data.get("previous_questions", [])

        # Validate types (extra safety)
        if not isinstance(previous_questions, list):
            previous_questions = []

        answer = chat_with_doc(context, current_question, previous_questions)
        return {"answer": answer}

    except Exception as e:
        print(f"❌ Chat endpoint error: {e}")
        return {"error": "An error occurred while processing your request."}
