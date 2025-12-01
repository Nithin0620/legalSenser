# AI Processing History Feature

## Overview

All AI operations (simplify, summarize, analyze-risk, compare, chat) are now automatically saved to the database. Users can view the complete history of all AI processing done on each document.

---

## How It Works

### 1. Automatic History Saving
Every time a user performs an AI operation on a document, the result is saved:
- **Simplify** - Stores simplified version
- **Summarize** - Stores summary and title
- **Analyze Risk** - Stores risks and recommendations
- **Compare** - Stores comparison results
- **Chat** - Stores each question and answer

### 2. Organized by Document
Each document has its own AI processing history, grouped by operation type.

### 3. View Anytime
Users can browse their history and expand any previous result to view full details.

---

## API Endpoints

### Perform AI Operations (Now saves history)

All these endpoints now accept either `text` OR `documentId`:

#### Simplify Document
```bash
POST /api/ai/simplify
Authorization: Bearer <token>

# Option 1: With documentId (saves to history)
{
  "documentId": "doc_123"
}

# Option 2: With raw text (no history)
{
  "text": "Legal document text..."
}
```

#### Summarize Document
```bash
POST /api/ai/summarize
Authorization: Bearer <token>

{
  "documentId": "doc_123"
}
```

#### Analyze Risk
```bash
POST /api/ai/analyze-risk
Authorization: Bearer <token>

{
  "documentId": "doc_123"
}
```

#### Chat with Document
```bash
POST /api/ai/chat
Authorization: Bearer <token>

{
  "documentId": "doc_123",
  "question": "What are the payment terms?",
  "history": []
}
```

**Note:** If you use `documentId`, the result is automatically saved to history. If you use `text` directly, no history is saved.

---

### Get Processing History

#### Get All History for a Document
```bash
GET /api/ai/history/:documentId
Authorization: Bearer <token>

# Optional query parameter to filter by type:
GET /api/ai/history/:documentId?type=simplify
```

**Response:**
```json
{
  "success": true,
  "document": {
    "_id": "doc_123",
    "title": "Contract Agreement"
  },
  "summary": {
    "total": 25,
    "simplify": 10,
    "summarize": 5,
    "analyzeRisk": 3,
    "compare": 2,
    "chat": 5
  },
  "history": {
    "simplify": [
      {
        "_id": "proc_1",
        "createdAt": "2025-12-01T10:00:00Z",
        "resultPreview": "This contract outlines the terms..."
      },
      {
        "_id": "proc_2",
        "createdAt": "2025-12-01T09:30:00Z",
        "resultPreview": "The agreement states that..."
      }
    ],
    "summarize": [
      {
        "_id": "proc_3",
        "createdAt": "2025-12-01T11:00:00Z",
        "resultPreview": "Service Agreement - Key terms..."
      }
    ],
    "analyze-risk": [
      {
        "_id": "proc_4",
        "createdAt": "2025-12-01T11:30:00Z",
        "resultPreview": "High risk: Unlimited liability clause..."
      }
    ],
    "compare": [],
    "chat": [
      {
        "_id": "proc_5",
        "createdAt": "2025-12-01T12:00:00Z",
        "question": "What are the payment terms?",
        "resultPreview": "According to the document..."
      }
    ]
  }
}
```

---

#### Get Specific Processing Result (Expanded View)
```bash
GET /api/ai/processing/:id
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "proc_1",
    "user": "user_id",
    "document": {
      "_id": "doc_123",
      "title": "Contract Agreement",
      "version": 1
    },
    "processingType": "simplify",
    "result": {
      "title": "Simplified Contract",
      "summary": "This is a service agreement between...",
      "bullet_points": [
        "Payment due within 30 days",
        "Service term is 12 months",
        "Either party can terminate with 30 days notice"
      ]
    },
    "createdAt": "2025-12-01T10:00:00Z",
    "updatedAt": "2025-12-01T10:00:00Z"
  }
}
```

---

#### Delete Processing Result
```bash
DELETE /api/ai/processing/:id
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Processing result deleted successfully"
}
```

---

## Frontend Integration Example

### Complete Flow with History

```typescript
import { useState, useEffect } from 'react';

interface ProcessingHistory {
  simplify: any[];
  summarize: any[];
  'analyze-risk': any[];
  compare: any[];
  chat: any[];
}

const DocumentAIPanel = ({ documentId }: { documentId: string }) => {
  const [history, setHistory] = useState<ProcessingHistory | null>(null);
  const [selectedProcessing, setSelectedProcessing] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'simplify' | 'summarize' | 'analyze-risk' | 'chat'>('simplify');

  // Load history on mount
  useEffect(() => {
    loadHistory();
  }, [documentId]);

  const loadHistory = async () => {
    const response = await fetch(`/api/ai/history/${documentId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const data = await response.json();
    setHistory(data.history);
  };

  // Perform AI operation
  const performSimplify = async () => {
    const response = await fetch('/api/ai/simplify', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ documentId })
    });
    
    const result = await response.json();
    
    // Reload history to show new entry
    await loadHistory();
    
    return result.data;
  };

  // View expanded result
  const viewProcessing = async (processingId: string) => {
    const response = await fetch(`/api/ai/processing/${processingId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const data = await response.json();
    setSelectedProcessing(data.data);
  };

  // Delete processing result
  const deleteProcessing = async (processingId: string) => {
    await fetch(`/api/ai/processing/${processingId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    await loadHistory();
  };

  return (
    <div className="ai-panel">
      {/* Tabs */}
      <div className="tabs">
        <button onClick={() => setActiveTab('simplify')}>
          Simplify ({history?.simplify.length || 0})
        </button>
        <button onClick={() => setActiveTab('summarize')}>
          Summarize ({history?.summarize.length || 0})
        </button>
        <button onClick={() => setActiveTab('analyze-risk')}>
          Analyze ({history?.['analyze-risk'].length || 0})
        </button>
        <button onClick={() => setActiveTab('chat')}>
          Chat ({history?.chat.length || 0})
        </button>
      </div>

      {/* Action Button */}
      <button onClick={performSimplify}>
        + New Simplify
      </button>

      {/* History List */}
      <div className="history-list">
        <h3>Previous Results</h3>
        {history?.[activeTab].map((item) => (
          <div key={item._id} className="history-item">
            <div className="preview">
              <small>{new Date(item.createdAt).toLocaleString()}</small>
              <p>{item.resultPreview}</p>
              {item.question && <p><strong>Q:</strong> {item.question}</p>}
            </div>
            <div className="actions">
              <button onClick={() => viewProcessing(item._id)}>
                View Full
              </button>
              <button onClick={() => deleteProcessing(item._id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Expanded View Modal */}
      {selectedProcessing && (
        <div className="modal">
          <h2>{selectedProcessing.processingType}</h2>
          <p><strong>Date:</strong> {new Date(selectedProcessing.createdAt).toLocaleString()}</p>
          
          {/* Display result based on type */}
          {selectedProcessing.processingType === 'simplify' && (
            <div>
              <h3>{selectedProcessing.result.title}</h3>
              <p>{selectedProcessing.result.summary}</p>
              <ul>
                {selectedProcessing.result.bullet_points?.map((point: string, i: number) => (
                  <li key={i}>{point}</li>
                ))}
              </ul>
            </div>
          )}
          
          {selectedProcessing.processingType === 'chat' && (
            <div>
              <p><strong>Q:</strong> {selectedProcessing.question}</p>
              <p><strong>A:</strong> {selectedProcessing.result.answer}</p>
            </div>
          )}
          
          <button onClick={() => setSelectedProcessing(null)}>Close</button>
        </div>
      )}
    </div>
  );
};

export default DocumentAIPanel;
```

---

## UI Design Suggestion

```
┌─────────────────────────────────────────┐
│ Document: Contract Agreement            │
├─────────────────────────────────────────┤
│ [Simplify (10)] [Summarize (5)]         │
│ [Analyze (3)]   [Chat (5)]              │
├─────────────────────────────────────────┤
│ [+ New Simplify]                        │
├─────────────────────────────────────────┤
│ Previous Results (10)                   │
│                                         │
│ ┌─────────────────────────────────────┐│
│ │ 📄 Dec 1, 2025 - 10:30 AM          ││
│ │ This contract outlines the terms... ││
│ │ [View Full] [Delete]                ││
│ └─────────────────────────────────────┘│
│                                         │
│ ┌─────────────────────────────────────┐│
│ │ 📄 Dec 1, 2025 - 10:15 AM          ││
│ │ The agreement establishes a...      ││
│ │ [View Full] [Delete]                ││
│ └─────────────────────────────────────┘│
│                                         │
│ ┌─────────────────────────────────────┐│
│ │ 📄 Dec 1, 2025 - 10:00 AM          ││
│ │ Service agreement between...        ││
│ │ [View Full] [Delete]                ││
│ └─────────────────────────────────────┘│
└─────────────────────────────────────────┘
```

---

## Benefits

✅ **Complete History** - Never lose AI processing results  
✅ **Organized by Type** - Easy to find specific operations  
✅ **Quick Preview** - See snippet without loading full result  
✅ **Expand on Demand** - View full details when needed  
✅ **Delete Control** - Remove unwanted results  
✅ **Per-Document** - Each document has its own history  
✅ **Timestamped** - Know when each operation was performed  

---

## Database Model

```typescript
{
  user: ObjectId,              // Owner
  document: ObjectId,          // Document reference
  processingType: "simplify" | "summarize" | "analyze-risk" | "compare" | "chat",
  inputText: string,           // Snippet of input (optional)
  question: string,            // For chat operations
  compareDoc: string,          // For compare operations
  result: Mixed,               // Flexible result format
  createdAt: Date,
  updatedAt: Date
}
```

---

## Example Scenarios

### Scenario 1: Multiple Simplifications
```
User uploads contract → Simplifies 3 times with different prompts
→ All 3 results saved in "Simplify" section
→ User can compare results and pick the best one
```

### Scenario 2: Iterative Risk Analysis
```
User analyzes risks → Makes changes → Analyzes again
→ Can view previous risk assessments
→ Track improvements over time
```

### Scenario 3: Chat History
```
User asks 10 questions about a document
→ All Q&As saved in "Chat" section
→ Can reference previous answers
→ Build knowledge base about document
```

---

## Key Points

- **Automatic** - History saved automatically when using `documentId`
- **Optional** - Use `text` parameter if you don't want history
- **Grouped** - Results organized by operation type
- **Searchable** - Filter by type via query parameter
- **Deletable** - Remove unwanted results anytime
- **Timestamped** - Always know when operation was performed

All AI processing history is tied to the document, making it easy to track all analyses and conversations for each legal document! 🎯
