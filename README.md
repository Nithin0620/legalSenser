# ⚖️ LegalSenser - AI-Powered Legal Document Assistant

LegalSenser is an AI-powered legal document analysis platform that extracts, summarizes, detects risks, compares revisions, and answers contextual questions about legal contracts and agreements.

---

## 🏛️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      React 18 Frontend                      │
│      Vite + Tailwind CSS + Framer Motion + Zustand Store    │
│              (Port 8080: Dashboard, Upload, Chat)           │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTP / JWT Bearer
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                    Express Backend API                      │
│           Node.js + TypeScript + MongoDB Mongoose           │
│           (Port 5000: Auth, Document OCR, Routing)          │
└───────────────┬──────────────────────────────┬──────────────┘
                │                              │
                ▼                              ▼
┌──────────────────────────────┐ ┌────────────────────────────┐
│      MongoDB Database        │ │    FastAPI AI Microservice  │
│  Users, Docs, Audit Trails   │ │    Python + Groq Llama 3   │
│        (Port 27017)          │ │   (Port 8000 / AI Prompts) │
└──────────────────────────────┘ └────────────────────────────┘
```

---

## 🚀 Key Features

* **Authentication & Profiles:** 
  * Email + 6-digit OTP verification via Nodemailer.
  * Google OAuth 2.0 integration.
  * JWT session persistence via Bearer tokens & HTTP-only cookies.
* **Document Ingestion & OCR:**
  * Supports PDF (`pdf-parse`), DOCX (`mammoth`), and Image OCR (`tesseract.js`).
  * Text extraction and version tracking.
* **AI Legal Intelligence:**
  * **Plain English Simplifier:** Translates complex clauses and legalese into everyday terms.
  * **Executive Summarization:** High-level summary capturing parties, purpose, and commitments.
  * **Risk & Compliance Detector:** Scans for predatory penalties, liabilities, indemnities, and jurisdiction flags with risk scores (0–100).
  * **Document Version Comparison:** Identifies added, removed, and modified clauses with legal impact analysis between two contracts.
  * **Contextual Legal Q&A:** Chatbot with conversational memory grounded in document text.
* **Audit Trails & Dashboard:**
  * Recent activity feed and document counts.
  * Full operation history with delete & search capabilities.

---

## 🛠️ Getting Started

### Prerequisites

* [Node.js](https://nodejs.org/) (v18+)
* [Python](https://www.python.org/) (v3.10+)
* [MongoDB](https://www.mongodb.com/) (local or MongoDB Atlas)
* [Groq API Key](https://console.groq.com/keys)

---

### Option A: Turnkey Setup with Docker Compose (Recommended)

1. **Configure Environment Variables:**
   * Copy `.env.example` in `backend/`, `ai/`, and `frontend/` to `.env` in each respective folder and fill in your keys.

2. **Launch all services:**
   ```bash
   docker-compose up --build
   ```

3. **Access the application:**
   * Frontend: `http://localhost:8080`
   * Backend API: `http://localhost:5000`
   * AI Microservice: `http://localhost:8000`

---

### Option B: Manual Local Setup

#### 1. AI Microservice
```bash
cd ai
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env      # Add your GROQ_API_KEY_1..5
uvicorn app:app --port 8000 --reload
```

#### 2. Express Backend
```bash
cd backend
npm install
cp .env.example .env      # Set MONGODB_URI, JWT_SECRET, EMAIL credentials
npm run dev
```

#### 3. Frontend
```bash
cd frontend
npm install
cp .env.example .env      # Set VITE_GOOGLE_CLIENT_ID
npm run dev
```

---

## 📡 API Endpoints

### 🔐 Authentication (`/api/auth`)
* `POST /api/auth/sendotp` — Sends email OTP code.
* `POST /api/auth/signup` — Completes registration with OTP verification.
* `POST /api/auth/login` — Email/password login.
* `POST /api/auth/login/google` — Google OAuth credential login.
* `GET /api/auth/checkauth` — Verifies current session.
* `POST /api/auth/logout` — Clears authentication session.

### 📄 Document Operations (`/api/documents`)
* `POST /api/documents/upload` — Upload file (PDF, DOCX, PNG, JPG) with OCR extraction.
* `GET /api/documents/all` — Retrieve all user documents.
* `GET /api/documents/:id` — Get document details and extracted text.
* `DELETE /api/documents/:id` — Delete document record.

### 🧠 AI Intelligence (`/api/ai`)
* `POST /api/ai/simplify` — Plain English simplification of document or raw text.
* `POST /api/ai/summarize` — Executive summary generation.
* `POST /api/ai/analyze-risk` — Multi-clause risk analysis and scoring.
* `POST /api/ai/compare` — Diffs two documents and extracts clause-by-clause changes.
* `POST /api/ai/chat` — Conversational Q&A with document context.
* `GET /api/ai/history` — Audit trail of all AI operations.
* `DELETE /api/ai/history/:id` — Delete an AI history record.

### 📊 Dashboard & Profile (`/api/dashboard`, `/api/profile`)
* `GET /api/dashboard/recent-activity` — Recent operations feed.
* `GET /api/dashboard/stats` — User statistics by document type.
* `GET /api/profile` — Fetch current user profile.
* `PUT /api/profile` — Update account profile details.

---

## 🔒 Security Best Practices

* Passwords salted & hashed with `bcrypt`.
* Dual-mode authentication: Bearer tokens via `Authorization` header & HTTP-only cookies.
* Centralized 401 error interception in Axios with automatic session refresh/logout.
* Clean file removal: uploaded raw temporary files are cleaned up immediately following text extraction.

---

## 📄 License

This project is licensed under the MIT License.
