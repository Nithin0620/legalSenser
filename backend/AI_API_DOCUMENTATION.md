# AI API Documentation

## Overview
The AI API endpoints provide flexible AI operations that can work **with or without uploaded documents**. All operations are automatically saved to history, allowing users to track and revisit their AI interactions.

## Base URL
```
http://localhost:5000/api/ai
```

## Authentication
All endpoints require JWT authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## AI Operations

### 1. Simplify Document/Text
**Endpoint:** `POST /api/ai/simplify`

**Description:** Simplifies legal text into plain English.

**Request Body:**
```json
{
  "text": "Optional: Direct text to simplify",
  "documentId": "Optional: MongoDB document ID",
  "title": "Optional: Custom title for history entry"
}
```

**Note:** Provide either `text` OR `documentId`. If both provided, `documentId` takes precedence.

**Response:**
```json
{
  "success": true,
  "message": "Document simplified successfully",
  "data": "Simplified text here...",
  "historyId": "674abc123..."
}
```

---

### 2. Summarize Document/Text
**Endpoint:** `POST /api/ai/summarize`

**Description:** Creates a concise summary of legal text.

**Request Body:**
```json
{
  "text": "Optional: Direct text to summarize",
  "documentId": "Optional: MongoDB document ID",
  "title": "Optional: Custom title for history entry"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Document summarized successfully",
  "data": "Summary text here...",
  "historyId": "674abc123..."
}
```

---

### 3. Analyze Risk
**Endpoint:** `POST /api/ai/analyze-risk`

**Description:** Analyzes legal text for potential risks and concerns.

**Request Body:**
```json
{
  "text": "Optional: Direct text to analyze",
  "documentId": "Optional: MongoDB document ID",
  "title": "Optional: Custom title for history entry"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Risk analysis completed successfully",
  "data": {
    "risks": [...],
    "severity": "high/medium/low"
  },
  "historyId": "674abc123..."
}
```

---

### 4. Compare Documents/Texts
**Endpoint:** `POST /api/ai/compare`

**Description:** Compares two documents or texts and highlights differences.

**Request Body:**
```json
{
  "doc1": "Optional: First text to compare",
  "doc2": "Optional: Second text to compare",
  "documentId1": "Optional: First document ID",
  "documentId2": "Optional: Second document ID",
  "title": "Optional: Custom title for history entry"
}
```

**Note:** Provide either text pairs OR documentId pairs. Mix and match allowed.

**Response:**
```json
{
  "success": true,
  "message": "Documents compared successfully",
  "data": {
    "differences": [...],
    "similarity": 0.85
  },
  "historyId": "674abc123..."
}
```

---

### 5. Chat with AI
**Endpoint:** `POST /api/ai/chat`

**Description:** Have a conversation with AI, optionally with document context.

**Request Body:**
```json
{
  "question": "Required: Your question",
  "documentId": "Optional: Document for context",
  "text": "Optional: Direct text for context",
  "history": [
    { "role": "user", "content": "Previous question" },
    { "role": "assistant", "content": "Previous answer" }
  ],
  "title": "Optional: Custom title for history entry"
}
```

**Note:** 
- `question` is always required
- If no `documentId` or `text` provided, general AI chat (no document context)
- `history` array maintains conversation context

**Response:**
```json
{
  "success": true,
  "message": "Chat response generated successfully",
  "data": "AI response here...",
  "historyId": "674abc123..."
}
```

---

## History Management

### 6. Get All History
**Endpoint:** `GET /api/ai/history`

**Description:** Get all AI operation history for the authenticated user.

**Query Parameters:**
- `type` (optional): Filter by operation type (simplify, summarize, analyze-risk, compare, chat)
- `limit` (optional, default: 50): Number of entries to return
- `skip` (optional, default: 0): Number of entries to skip (pagination)

**Example:**
```
GET /api/ai/history?type=simplify&limit=20&skip=0
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "674abc123...",
      "user": "674xyz...",
      "document": {
        "_id": "674doc...",
        "title": "Contract.pdf",
        "version": 1
      },
      "operationType": "simplify",
      "title": "Simplified Contract 12/1/2024",
      "inputText": "Preview of input...",
      "result": "Full result...",
      "isFavorite": false,
      "createdAt": "2024-12-01T10:30:00Z",
      "updatedAt": "2024-12-01T10:30:00Z"
    }
  ],
  "pagination": {
    "total": 100,
    "limit": 50,
    "skip": 0,
    "hasMore": true
  }
}
```

---

### 7. Get History by Document
**Endpoint:** `GET /api/ai/history/document/:documentId`

**Description:** Get all AI operations performed on a specific document.

**Query Parameters:**
- `type` (optional): Filter by operation type

**Example:**
```
GET /api/ai/history/document/674doc123?type=simplify
```

**Response:**
```json
{
  "success": true,
  "document": {
    "_id": "674doc123",
    "title": "Contract.pdf"
  },
  "summary": {
    "total": 15,
    "simplify": 5,
    "summarize": 3,
    "analyzeRisk": 2,
    "compare": 3,
    "chat": 2
  },
  "history": {
    "simplify": [
      {
        "_id": "674abc1...",
        "title": "Simplified 12/1/2024",
        "createdAt": "2024-12-01T10:30:00Z",
        "isFavorite": false,
        "resultPreview": "Preview of result..."
      }
    ],
    "summarize": [...],
    "analyze-risk": [...],
    "compare": [...],
    "chat": [...]
  }
}
```

---

### 8. Get History by Type
**Endpoint:** `GET /api/ai/history/type/:operationType`

**Description:** Get all operations of a specific type.

**Valid Operation Types:**
- simplify
- summarize
- analyze-risk
- compare
- chat

**Query Parameters:**
- `limit` (optional, default: 50)
- `skip` (optional, default: 0)

**Example:**
```
GET /api/ai/history/type/simplify?limit=10
```

**Response:**
```json
{
  "success": true,
  "operationType": "simplify",
  "data": [...],
  "pagination": {
    "total": 50,
    "limit": 10,
    "skip": 0,
    "hasMore": true
  }
}
```

---

### 9. Get Specific History Entry
**Endpoint:** `GET /api/ai/history/:id`

**Description:** Get full details of a specific history entry.

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "674abc123...",
    "user": "674xyz...",
    "document": {
      "_id": "674doc...",
      "title": "Contract.pdf",
      "version": 1
    },
    "operationType": "simplify",
    "title": "Simplified Contract",
    "inputText": "Full input text...",
    "result": "Full result...",
    "isFavorite": true,
    "createdAt": "2024-12-01T10:30:00Z",
    "updatedAt": "2024-12-01T10:30:00Z"
  }
}
```

---

### 10. Toggle Favorite
**Endpoint:** `PUT /api/ai/history/:id/favorite`

**Description:** Mark/unmark a history entry as favorite.

**Response:**
```json
{
  "success": true,
  "message": "Favorite status updated",
  "isFavorite": true
}
```

---

### 11. Get Favorites
**Endpoint:** `GET /api/ai/history/favorites`

**Description:** Get all favorite history entries.

**Query Parameters:**
- `limit` (optional, default: 50)
- `skip` (optional, default: 0)

**Response:**
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "total": 25,
    "limit": 50,
    "skip": 0,
    "hasMore": false
  }
}
```

---

### 12. Delete History Entry
**Endpoint:** `DELETE /api/ai/history/:id`

**Description:** Delete a specific history entry.

**Response:**
```json
{
  "success": true,
  "message": "Processing result deleted successfully"
}
```

---

## Use Cases

### Use Case 1: Quick Text Simplification (Homepage)
User wants to simplify text without uploading a document:

```javascript
fetch('/api/ai/simplify', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer token',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    text: "The party of the first part hereby agrees...",
    title: "Quick Simplification"
  })
})
```

### Use Case 2: Document-Based Analysis
User uploads a document and wants to analyze it:

```javascript
// First upload document
const uploadResponse = await fetch('/api/documents/upload', {
  method: 'POST',
  body: formData
});
const { documentId } = await uploadResponse.json();

// Then analyze it
await fetch('/api/ai/analyze-risk', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer token',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    documentId,
    title: "Risk Analysis of Contract"
  })
})
```

### Use Case 3: View All Simplifications of a Document
User wants to see all 10 times they simplified a specific document:

```javascript
const response = await fetch('/api/ai/history/document/674doc123?type=simplify', {
  headers: { 'Authorization': 'Bearer token' }
});
const { history } = await response.json();

// Display history.simplify array (all 10 entries)
history.simplify.forEach(entry => {
  console.log(entry.title, entry.createdAt);
});
```

### Use Case 4: Chat Without Document
User wants to ask general legal questions:

```javascript
fetch('/api/ai/chat', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer token',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    question: "What is force majeure?",
    history: [],
    title: "General Legal Chat"
  })
})
```

---

## Error Responses

All endpoints follow a consistent error format:

```json
{
  "success": false,
  "message": "Error description here"
}
```

**Common HTTP Status Codes:**
- `400`: Bad Request (missing required fields)
- `401`: Unauthorized (missing or invalid JWT token)
- `404`: Not Found (document or history entry doesn't exist)
- `500`: Internal Server Error

---

## Notes

1. **Dual Mode Operations**: All AI operations (simplify, summarize, analyze-risk) can work with either direct text OR document references, making them flexible for both quick operations and persistent document workflows.

2. **Automatic History Tracking**: Every AI operation is automatically saved to history with a preview of inputs and full results, enabling users to revisit past analyses.

3. **Document Versioning Integration**: When operations are performed on documents, the document's `lastProcessedAt` field is updated automatically.

4. **Title Customization**: Users can provide custom titles for history entries, or the system will generate default titles with timestamps.

5. **Pagination**: All list endpoints support pagination via `limit` and `skip` query parameters to handle large datasets efficiently.

6. **Favorites**: Users can mark important analyses as favorites for quick access later.
