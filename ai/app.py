from fastapi import FastAPI, Request
from pydantic import BaseModel
from simplify import simplify_document
from compare import compare_docs
from analyze_risk import analyze_risk
from chat import chat_with_doc
from summarize import generate_summary_and_title

app = FastAPI(title="LegalSenser AI Microservice")

class SimplifyRequest(BaseModel):
    text: str

class SummarizeRequest(BaseModel):
    text: str

class CompareRequest(BaseModel):
    doc1: str
    doc2: str

class RiskRequest(BaseModel):
    text: str

class ChatRequest(BaseModel):
    context: str
    question: str
    history: list = []

@app.get("/")
def root():
    return {"status": "ok", "message": "LegalSenser AI is running"}


@app.post("/simplify")
async def simplify(request: SimplifyRequest):
    """
    Summarizes and simplifies legal document.
    Returns title, summary paragraph, and bullet points.
    """
    result = simplify_document(request.text)
    return result


@app.post("/compare")
async def compare(request: CompareRequest):
    """
    Compares two documents and returns summary of changes.
    """
    result = compare_docs(request.doc1, request.doc2)
    return result


@app.post("/analyze-risk")
async def analyze(request: RiskRequest):
    """
    Analyzes document for risks and provides recommendations.
    """
    result = analyze_risk(request.text)
    return result


@app.post("/chat")
async def chat(request: ChatRequest):
    """
    Q&A with document context.
    """
    try:
        answer = chat_with_doc(request.context, request.question, request.history)
        return {"answer": answer}
    except Exception as e:
        return {"error": str(e)}


@app.post("/summarize")
async def summarize(request: SummarizeRequest):
    """
    Summarizes text and generates a title.
    Returns title and summary.
    """
    result = generate_summary_and_title(request.text)
    return result