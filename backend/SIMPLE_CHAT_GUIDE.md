# Simplified Document & AI Chat System

## Overview

Simple and straightforward document management with AI chat capabilities.

---

## How It Works

### 1. Upload Document
Upload a PDF, DOCX, or Image → Text is extracted and stored in database

### 2. Chat with Document
Send questions with the document ID → AI uses the document text as context → Returns answers

**No separate chat sessions or complex state management.**

---

## API Endpoints

### Document Management

#### Upload Document
```bash
POST /api/documents/upload
Content-Type: multipart/form-data
Authorization: Bearer <token>

Body:
- file: <your_file>
- title: "My Contract" (optional)
```

**Response:**
```json
{
  "success": true,
  "document": {
    "_id": "doc_123",
    "title": "My Contract",
    "documentType": "pdf",
    "version": 1
  }
}
```

---

#### Get All Documents
```bash
GET /api/documents/all
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "count": 5,
  "documents": [
    {
      "_id": "doc_123",
      "title": "My Contract",
      "documentType": "pdf",
      "version": 1,
      "uploadedAt": "2025-12-01T..."
    }
  ]
}
```

---

#### Get Document Details
```bash
GET /api/documents/:id
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "document": {
    "_id": "doc_123",
    "title": "My Contract",
    "originalText": "Full document text...",
    "documentType": "pdf",
    "version": 1
  }
}
```

---

### AI Chat with Document

#### Ask Questions
```bash
POST /api/ai/chat
Authorization: Bearer <token>
Content-Type: application/json

Body:
{
  "documentId": "doc_123",
  "question": "What are the payment terms?",
  "history": []
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "answer": "According to the document, the payment terms are..."
  }
}
```

---

#### Continue Conversation
```bash
POST /api/ai/chat
Authorization: Bearer <token>
Content-Type: application/json

Body:
{
  "documentId": "doc_123",
  "question": "What about the termination clause?",
  "history": [
    {
      "role": "user",
      "content": "What are the payment terms?"
    },
    {
      "role": "assistant",
      "content": "According to the document, the payment terms are..."
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "answer": "The termination clause states that..."
  }
}
```

---

### Other AI Features

All work the same way - just send text and get AI-processed results:

#### Simplify Document
```bash
POST /api/ai/simplify
Body: { "text": "legal document text..." }
```

#### Summarize Document
```bash
POST /api/ai/summarize
Body: { "text": "document text..." }
```

#### Compare Documents
```bash
POST /api/ai/compare
Body: { "doc1": "text1...", "doc2": "text2..." }
```

#### Analyze Risk
```bash
POST /api/ai/analyze-risk
Body: { "text": "document text..." }
```

---

## Frontend Integration Example

```typescript
// 1. Upload document
const uploadDoc = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('title', 'My Contract');
  
  const res = await fetch('/api/documents/upload', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
    body: formData
  });
  
  const data = await res.json();
  return data.document._id; // Save this ID
};

// 2. Chat with document
const askQuestion = async (documentId: string, question: string, history: any[] = []) => {
  const res = await fetch('/api/ai/chat', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ documentId, question, history })
  });
  
  const data = await res.json();
  return data.data.answer;
};

// 3. Complete conversation flow
const chatWithDocument = async (file: File) => {
  // Upload
  const docId = await uploadDoc(file);
  
  // Start conversation
  const history: any[] = [];
  
  // Ask first question
  const answer1 = await askQuestion(docId, "What are the payment terms?");
  history.push(
    { role: "user", content: "What are the payment terms?" },
    { role: "assistant", content: answer1 }
  );
  
  // Ask follow-up question with history
  const answer2 = await askQuestion(docId, "What about penalties?", history);
  history.push(
    { role: "user", content: "What about penalties?" },
    { role: "assistant", content: answer2 }
  );
  
  // Continue conversation...
  const answer3 = await askQuestion(docId, "Explain more", history);
};
```

---

## Chat History Management

**Frontend Responsibility:**
- Store conversation history in component state or localStorage
- Pass history array when asking follow-up questions
- Clear history when starting new conversation

**Backend:**
- Just processes the request with given context and history
- Updates `lastProcessedAt` timestamp on document
- No persistent chat sessions in database

---

## Benefits

✅ **Simple** - No complex session management  
✅ **Flexible** - Frontend controls conversation flow  
✅ **Stateless** - Each request is independent  
✅ **Fast** - No extra database lookups for sessions  
✅ **Clear** - Easy to understand and debug  

---

## Example Usage Flow

```
1. User uploads contract.pdf
   → Document stored with ID: doc_123

2. User asks: "What are the terms?"
   → POST /api/ai/chat { documentId: "doc_123", question: "...", history: [] }
   → AI reads doc_123 text + answers
   → Frontend saves answer to history

3. User asks: "What about payment?"
   → POST /api/ai/chat { documentId: "doc_123", question: "...", history: [prev Q&A] }
   → AI has context from history + document
   → Returns better answer

4. User closes chat
   → Frontend clears history (optional: save to localStorage)

5. User returns later
   → Same document, new conversation
   → Or resume by loading history from localStorage
```

---

## Key Points

- **Document ID** is all you need to chat with a document
- **History** is optional - pass it for context-aware responses
- **No sessions** - each chat request is independent
- **Frontend stores** conversation history if needed
- **Simple** and **scalable** architecture

---

## Complete API Summary

**Documents:**
- `POST /api/documents/upload` - Upload new document
- `POST /api/documents/upload-version` - Upload new version
- `GET /api/documents/all` - List all documents
- `GET /api/documents/:id` - Get document details
- `GET /api/documents/:id/versions` - Get version history
- `DELETE /api/documents/:id` - Delete document
- `POST /api/documents/save` - Add to saved documents

**AI (with document context):**
- `POST /api/ai/chat` - Chat with document
- `POST /api/ai/simplify` - Simplify text
- `POST /api/ai/summarize` - Summarize text
- `POST /api/ai/compare` - Compare documents
- `POST /api/ai/analyze-risk` - Analyze risks

All AI endpoints require authentication with JWT token.
