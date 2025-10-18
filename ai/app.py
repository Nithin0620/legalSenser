from fastapi import FastAPI
from simplify import simplify_text
from summarize import summarize_text
from compare import compare_docs
from analyze_risk import analyze_risk
from chat import chat_with_doc

app = FastAPI(title="LegalSenser AI Microservice")

@app.get("/")
def root():
    return {"message": "AI microservice is running 🚀"}

@app.post("/simplify")
def simplify(data: dict):
    return {"result": simplify_text(data["text"])}

@app.post("/summarize")
def summarize(data: dict):
    return {"result": summarize_text(data["text"])}

@app.post("/compare")
def compare(data: dict):
    return {"result": compare_docs(data["doc1"], data["doc2"])}

@app.post("/analyze-risk")
def analyze(data: dict):
    return {"result": analyze_risk(data["text"])}

@app.post("/chat")
def chat(data: dict):
    return {"result": chat_with_doc(data["context"], data["question"])}
