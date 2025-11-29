##🧠 LegalSenser AI Microservice

This repository powers the AI layer of the LegalSenser full-stack app.
It handles document understanding, simplification, risk analysis, comparison, and contextual Q&A using modern transformer models hosted on Hugging Face Spaces.

## 🚀 Quick Start (After Cloning)

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Run the Server
```bash
cd ai
python -m uvicorn app:app --reload --host 127.0.0.1 --port 8000
```

Or from the root directory:
```bash
python -m uvicorn ai.app:app --reload --host 127.0.0.1 --port 8000
```

### 3. Access the API
- Main endpoint: http://127.0.0.1:8000
- API Documentation: http://127.0.0.1:8000/docs

**Note:** First API call will take longer as models are downloaded and cached.

---

⚙️ Architecture Overview
Frontend (React / Next.js)
          ↓
Backend (Node.js + Express)
          ↓
AI Layer (FastAPI on Hugging Face)
          ↓
Transformers / LLMs (Flan-T5, Llama, etc.)


The Node backend simply forwards text or extracted content to this FastAPI microservice.
The microservice then performs specific AI operations (simplify, analyze, compare, chat) and returns structured results.

📁 Folder Structure
ai/
│
├── app.py                 # Main FastAPI entry point
├── simplify.py            # Simplifies and summarizes documents
├── analyze_risk.py        # Detects and classifies risk in clauses
├── compare.py             # Compares two legal documents
├── chat_with_doc.py       # Context-aware Q&A assistant
├── requirements.txt       # Python dependencies
└── README.md              # This file

🧩 Components Explained
1️⃣ simplify.py

Purpose:
Simplifies complex legal text into easy language and highlights key clauses with risk levels.

Model Used:
google/flan-t5-large (text-to-text model for summarization & simplification)

Input:

{
  "document_text": "Full extracted document text"
}


Output:

{
  "simplifiedText": "Plain-English simplified version of the text.",
  "aiHighlights": [
    {"clause": "Payment term", "riskLevel": "Medium", "suggestion": "Clarify interest rate."},
    {"clause": "Termination clause", "riskLevel": "High", "suggestion": "Review termination rights."}
  ],
  "title": "Simplified Document Summary"
}

2️⃣ analyze_risk.py

Purpose:
Analyzes each clause to estimate risk exposure, compliance flags, and recommendations.

Model Used:
google/flan-t5-large — used in analytical mode with a prompt for risk classification.

Input:

{
  "document_text": "Full text of legal agreement",
  "document_type": "pdf" | "docx" | "image"
}


Output:

{
  "overallRiskLevel": "Medium",
  "clauseRisks": [
    {"clause": "Late payment penalty", "riskLevel": "High", "reason": "Financial exposure"},
    {"clause": "Warranty term", "riskLevel": "Low", "reason": "Standard commercial term"}
  ],
  "recommendations": [
    "Negotiate a longer payment window.",
    "Review indemnity clauses."
  ]
}

3️⃣ compare.py

Purpose:
Compares two versions of a document and shows differences with potential impacts.

Model Used:
Python built-in difflib for efficient text diffing.
(No LLM used — lightweight and deterministic.)

Input:

{
  "old_text": "Original contract version",
  "new_text": "Updated contract version"
}


Output:

{
  "addedClauses": ["Clause about penalty fees added"],
  "removedClauses": ["Refund policy removed"],
  "modifiedClauses": [
    {
      "old": "Payment within 30 days.",
      "new": "Payment within 15 days.",
      "impact": "Increases financial pressure on client."
    }
  ],
  "summary": "The new version shortens payment time and removes refund clauses."
}

4️⃣ chat_with_doc.py

Purpose:
Provides contextual Q&A about a document — remembers previous exchanges and answers the latest question precisely.

Model Used:
google/flan-t5-large (text-generation model optimized for question answering).
Can later be upgraded to Llama 3.1 70B (Groq) for higher reasoning accuracy.

Input:

{
  "context": "Full document text",
  "current_question": "User's latest question",
  "previous_questions": [
    {"user": "Who are the parties?", "response": "ABC Pvt Ltd and XYZ Corp."},
    {"user": "What is the payment term?", "response": "Payment within 30 days."}
  ]
}


Output:

{
  "answer": "Late payments incur a 10% penalty. This means the payer must pay an additional 10% if payment is delayed beyond 30 days."
}

🚀 Main API Endpoints (FastAPI)
Endpoint	Method	Purpose	Calls
/simplify	POST	Simplifies and summarizes document	simplify.py
/analyze-risk	POST	Deep risk assessment	analyze_risk.py
/compare	POST	Compare two document versions	compare.py
/chat	POST	Context-aware Q&A chat	chat_with_doc.py
🧾 Example Usage (via curl)
curl -X POST "https://yourspace.hf.space/chat" \
  -H "Content-Type: application/json" \
  -d '{
        "context": "This Agreement is between ABC Pvt Ltd and XYZ Corp. Payment must be made within 30 days.",
        "current_question": "Who are the parties in this agreement?",
        "previous_questions": []
      }'


Response:

{
  "answer": "The parties are ABC Pvt Ltd and XYZ Corp."
}

🧰 Setup & Deployment
Local Development
# Create a virtual environment
python -m venv venv
source venv/bin/activate   # (Windows: venv\Scripts\activate)

# Install dependencies
pip install -r requirements.txt

# Run FastAPI server
uvicorn app:app --reload


Access at → http://127.0.0.1:8000/docs

Deploy on Hugging Face Spaces

Create a new Space → Type: FastAPI

Upload all files (app.py, model files, requirements.txt, etc.)

Hugging Face will automatically build and host your API.

You’ll get a public endpoint like:

https://username-legalsenser.hf.space/simplify

🧠 Models Summary
Model	Type	Purpose	Library
google/flan-t5-large	Seq2Seq (Text2Text)	Summarization, simplification, Q&A	🤗 Transformers
difflib (Python stdlib)	Text diff	Document comparison	Built-in
(Optional) Llama-3.1-70B-Groq	Chat / Reasoning	Upgrade for contextual QA	Groq API
🧩 Integration with Node.js Backend

Your Node.js backend calls these endpoints like this:

const response = await axios.post("https://yourspace.hf.space/chat", {
  context,
  current_question,
  previous_questions
});
res.json({ answer: response.data.answer });