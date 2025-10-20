# legalSenser

⚖️ LegalSenser AI Microservice

A lightweight FastAPI-based AI backend for LegalSenser, built to simplify, summarize, analyze, and compare legal documents.
This microservice provides multiple AI-powered endpoints for contract simplification, risk detection, document comparison, and intelligent chat with uploaded documents.

🚀 Overview

LegalSenser is a full-stack AI platform designed to help users understand complex legal documents easily.
This repository contains the AI layer of the project, built in Python (FastAPI) and deployable on Hugging Face Spaces or any cloud service.

🔍 Core Capabilities

Simplifies legal documents into plain language

Summarizes contracts and extracts key clauses

Compares two versions of a contract and highlights changes

Analyzes risks in legal clauses (High/Medium/Low)

Provides interactive Q&A chat about the uploaded document

🧠 Tech Stack
Component	Description
Backend Framework	FastAPI
AI Models	Transformers (e.g., BART, T5, or GPT-based)
Libraries Used	transformers, fastapi, uvicorn, pydantic
Deployment	Hugging Face Spaces / Render / Localhost
Integration	Called by the Node.js backend of LegalSenser
🧩 Folder Structure
📁 LegalSenser-AI/
│
├── ai_legal_simplify.py       # Simplification + Summarization logic
├── analyze_risk.py            # Clause-level risk analysis logic
├── compare.py                 # Old vs new document comparison logic
├── chat.py                    # Document-based Q&A chatbot logic
├── app.py                     # Main FastAPI server
├── requirements.txt           # Dependencies for Hugging Face or local run
└── README.md                  # Documentation (this file)

⚙️ API Endpoints
🟢 GET /

Purpose: Health check to confirm the service is running
Response:

{ "message": "AI microservice is running 🚀" }

🟦 POST /simplify

Description: Simplifies and summarizes a legal document.
Input:

{
  "text": "Original document text..."
}


Response:

{
  "result": {
    "title": "Simplified NDA Agreement",
    "summary": "This document outlines confidentiality terms...",
    "simplifiedPoints": [
      "Parties must not share confidential info.",
      "The agreement is valid for 2 years."
    ]
  }
}


🧠 Internally calls analyze_contract() from ai_legal_simplify.py.

🟧 POST /compare

Description: Compares two document versions and highlights changes.
Input:

{
  "doc1": "Old version text...",
  "doc2": "New version text..."
}


Response:

{
  "result": {
    "added": ["Clause about data retention added."],
    "removed": ["Clause about arbitration removed."],
    "modified": ["Termination period changed from 30 to 60 days."]
  }
}


🧠 Internally calls compare_docs() from compare.py.

🟥 POST /analyze-risk

Description: Detects high/medium/low risk clauses in the document.
Input:

{
  "text": "Contract text here...",
  "document_type": "pdf"
}


Response:

{
  "result": [
    {"clause": "Termination without cause", "riskLevel": "High", "suggestion": "May expose you to sudden contract termination."},
    {"clause": "Confidentiality clause", "riskLevel": "Low", "suggestion": "Ensure data handling is well defined."}
  ]
}


🧠 Internally calls analyze_risk() from analyze_risk.py.

🟪 POST /chat

Description: Conversational Q&A on the uploaded legal document.
Input:

{
  "context": "Full contract text...",
  "current_question": "What happens if the agreement is breached?",
  "previous_questions": [
    {"user": "What is the effective date?", "response": "The agreement starts on Jan 1, 2025."}
  ]
}


Response:

{
  "answer": "If breached, the non-breaching party may terminate the agreement and seek damages."
}


🧠 Internally calls chat_with_doc() from chat.py.

🧾 Example Node.js Integration

In your Node.js backend:

const response = await axios.post("https://your-hf-space.hf.space/simplify", {
  text: extractedText,
});
const simplifiedData = response.data.result;

🧰 Installation (for Local Testing)
git clone https://github.com/yourusername/LegalSenser-AI.git
cd LegalSenser-AI
pip install -r requirements.txt
uvicorn app:app --reload


Visit:
👉 http://127.0.0.1:8000

☁️ Deploy on Hugging Face

Create a new Hugging Face Space (type: “FastAPI”).

Upload:

app.py

Your Python logic files

requirements.txt

It will automatically build and host your API at:
https://yourusername-legal-senser.hf.space

You can then call these endpoints directly from your Node.js backend or React frontend.

🧠 Example requirements.txt
fastapi
uvicorn
transformers
torch
pydantic
requests

📚 Future Enhancements

Fine-tune models for Indian legal documents

Add multilingual support (Hindi → English)

Integrate with RAG (Retrieval-Augmented Generation) for context-aware Q&A

Add PDF export of simplified summaries

👨‍💻 Author

KS Nithin
B.Tech IT @ MSIT | Aspiring Full-Stack & AI Developer
🌐 Building impactful AI tools for legal and social good
