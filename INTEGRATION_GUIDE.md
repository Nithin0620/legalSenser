# Complete LegalSenser Frontend-Backend Integration Guide

## 🎯 Project Status

### Backend ✅ (Completed & Tested)
- Express server running on port 5000
- MongoDB Atlas connected
- All auth endpoints working (OTP, signup, login, logout)
- All document endpoints working (upload, list, delete)
- All AI endpoints connected to FastAPI microservice
- Dashboard analytics endpoint working

### Frontend ✅ (Core Auth & Dashboard Built)
- Zustand stores (authStore, documentStore)
- Axios API client with interceptors
- Login/Signup pages with OTP flow
- Dashboard with recent activity
- Sidebar navigation (unique gradient design)
- Responsive mobile design

### Remaining Pages (To Build)
- Upload.tsx
- Documents.tsx  
- Chat.tsx
- History.tsx
- Settings.tsx
- Navbar.tsx (partial update)

---

## 📋 Backend API Reference

### Base URL
```
http://localhost:5000/api
```

### Auth Endpoints

#### 1. Send OTP
```http
POST /auth/sendotp
Content-Type: application/json

{
  "email": "user@example.com"
}

Response:
{
  "message": "OTP sent to email",
  "status": "success"
}
```

#### 2. Signup with OTP
```http
POST /auth/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "name": "John Doe",
  "password": "password123",
  "otp": "123456"
}

Response:
{
  "message": "User registered successfully",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "user"
  }
}
```

#### 3. Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "user"
  }
}
```

#### 4. Check Auth
```http
GET /auth/checkauth
Authorization: Bearer <token>

Response:
{
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "user"
  },
  "isAuthenticated": true
}
```

#### 5. Logout
```http
POST /auth/logout
Authorization: Bearer <token>

Response:
{
  "message": "Logout successful"
}
```

---

### Document Endpoints

#### 1. Upload Document
```http
POST /documents/upload
Authorization: Bearer <token>
Content-Type: multipart/form-data

Form Data:
- file: File object
- type: "contract" | "agreement" | "policy" (optional)

Response:
{
  "message": "Document uploaded successfully",
  "document": {
    "id": "doc_id",
    "userId": "user_id",
    "filename": "contract.pdf",
    "url": "path/to/file",
    "type": "contract",
    "uploadedAt": "2024-01-01T12:00:00Z",
    "versions": [
      {
        "versionId": "v1",
        "fileUrl": "path/to/file",
        "createdAt": "2024-01-01T12:00:00Z"
      }
    ]
  }
}
```

#### 2. Get All Documents
```http
GET /documents/all
Authorization: Bearer <token>

Response:
{
  "documents": [
    {
      "id": "doc_id",
      "filename": "contract.pdf",
      "type": "contract",
      "uploadedAt": "2024-01-01T12:00:00Z",
      "url": "path/to/file"
    }
  ]
}
```

#### 3. Get Single Document
```http
GET /documents/{documentId}
Authorization: Bearer <token>

Response:
{
  "document": {
    "id": "doc_id",
    "filename": "contract.pdf",
    "content": "Document text content...",
    "type": "contract",
    "versions": [...]
  }
}
```

#### 4. Delete Document
```http
DELETE /documents/{documentId}
Authorization: Bearer <token>

Response:
{
  "message": "Document deleted successfully"
}
```

---

### AI Endpoints

#### 1. Simplify
```http
POST /ai/simplify
Authorization: Bearer <token>
Content-Type: application/json

{
  "documentId": "doc_id",  // OR use "text" instead
  "text": "Complex legal text...",
  "title": "Document Title"
}

Response:
{
  "simplified": "Simpler version of text...",
  "status": "success"
}
```

#### 2. Summarize
```http
POST /ai/summarize
Authorization: Bearer <token>
Content-Type: application/json

{
  "documentId": "doc_id",
  "text": "Long document text...",
  "title": "Document Title"
}

Response:
{
  "summary": "Summary of document...",
  "status": "success"
}
```

#### 3. Analyze Risk
```http
POST /ai/analyze-risk
Authorization: Bearer <token>
Content-Type: application/json

{
  "documentId": "doc_id",
  "text": "Legal text to analyze...",
  "title": "Document Title"
}

Response:
{
  "analysis": "Risk analysis results...",
  "status": "success"
}
```

#### 4. Compare
```http
POST /ai/compare
Authorization: Bearer <token>
Content-Type: application/json

{
  "doc1": "First document ID or text",
  "doc2": "Second document ID or text",
  "title": "Comparison Title"
}

Response:
{
  "comparison": "Comparison results...",
  "status": "success"
}
```

#### 5. Chat
```http
POST /ai/chat
Authorization: Bearer <token>
Content-Type: application/json

{
  "question": "What are the key terms?",
  "documentId": "doc_id",
  "history": [
    {
      "role": "user",
      "content": "Previous question"
    },
    {
      "role": "assistant",
      "content": "Previous answer"
    }
  ],
  "title": "Chat Title"
}

Response:
{
  "answer": "Answer to the question...",
  "status": "success"
}
```

---

### Dashboard Endpoints

#### 1. Recent Activity
```http
GET /dashboard/recent-activity
Authorization: Bearer <token>

Response:
{
  "recentActivity": [
    {
      "id": "activity_id",
      "userId": "user_id",
      "type": "upload|chat|simplify|summarize|analyze-risk|compare",
      "documentName": "contract.pdf",
      "description": "User Action Description",
      "timestamp": "2024-01-01T12:00:00Z"
    }
  ]
}
```

---

## 🔗 Frontend Integration Points

### authStore → Backend
```typescript
// sendOtp
POST /auth/sendotp { email }
→ Response: success message

// signupWithOtp  
POST /auth/signup { email, name, password, otp }
→ Response: { user, message }

// login
POST /auth/login { email, password }
→ Response: { token, user }

// checkAuth
GET /auth/checkauth (with Bearer token)
→ Response: { user, isAuthenticated }

// logout
POST /auth/logout (with Bearer token)
→ Response: { message }
```

### documentStore → Backend
```typescript
// fetchDocuments
GET /documents/all (with Bearer token)
→ Response: { documents }

// uploadDocument
POST /documents/upload FormData (with Bearer token)
→ Response: { document }

// getDocument
GET /documents/{id} (with Bearer token)
→ Response: { document }

// deleteDocument
DELETE /documents/{id} (with Bearer token)
→ Response: { message }

// simplify
POST /ai/simplify { documentId, text, title } (with Bearer token)
→ Response: { simplified }

// summarize
POST /ai/summarize { documentId, text, title } (with Bearer token)
→ Response: { summary }

// analyzeRisk
POST /ai/analyze-risk { documentId, text, title } (with Bearer token)
→ Response: { analysis }

// compare
POST /ai/compare { doc1, doc2, title } (with Bearer token)
→ Response: { comparison }

// chatWithDocument
POST /ai/chat { question, documentId, history, title } (with Bearer token)
→ Response: { answer }

// fetchRecentActivity
GET /dashboard/recent-activity (with Bearer token)
→ Response: { recentActivity }
```

---

## 🚀 Running Both Frontend & Backend

### Terminal 1 - Backend
```bash
cd backend
npm install  # if not done
npm start
# Server runs on http://localhost:5000
```

### Terminal 2 - Frontend
```bash
cd frontend
npm install  # if not done
npm run dev
# App runs on http://localhost:5173
```

### Browser
Open http://localhost:5173

---

## 🧪 End-to-End Test Flow

### 1. New User Signup
```
1. Navigate to http://localhost:5173/signup
2. Fill form: name, email, password
3. Click "Continue"
4. Page switches to OTP step
5. Check email for OTP code
6. Enter OTP and click "Verify & Create Account"
7. Redirected to /login page
8. Frontend: authStore.signupWithOtp called API endpoint
9. Backend: Created user in MongoDB, sent activity record
```

### 2. User Login
```
1. On /login page, enter email and password
2. Click "Sign In"
3. Frontend: authStore.login calls API
4. Backend: Validates credentials, returns JWT token
5. Frontend: Stores token in localStorage via persist middleware
6. Navigate to /dashboard (auto-redirect)
7. Frontend: authStore.isAuthenticated = true
```

### 3. Dashboard Recent Activity
```
1. On /dashboard, Recent Activity section visible
2. Frontend: documentStore.fetchRecentActivity() called
3. Backend: GET /dashboard/recent-activity returns activities
4. Frontend: Displays last 5 activities with icons and timestamps
5. Each activity shows: description, documentName, type, timestamp
```

### 4. Upload Document (When Built)
```
1. Navigate to /upload page
2. Select or drag file
3. Frontend: documentStore.uploadDocument(file) called
4. Backend: Stores file, returns document ID
5. Frontend: Adds to documents array
6. Dashboard recent activity updates with "upload" event
```

### 5. AI Operations (When Built)
```
1. On document detail page
2. Click "Simplify", "Summarize", "Analyze Risk", etc.
3. Frontend: documentStore.simplify/summarize/etc called
4. Backend: Calls FastAPI AI microservice
5. Returns result to frontend
6. Frontend: Displays result
7. Backend: Records activity in RecentActivity
8. Dashboard updates to show AI operation
```

### 6. Logout
```
1. Click Sidebar user profile section
2. Click "Logout" button
3. Frontend: authStore.logout() called API
4. Backend: Invalidates session (optional)
5. Frontend: Clears localStorage
6. Navigate to /login
7. authStore.isAuthenticated = false
```

---

## 🔐 Authentication Flow Diagram

```
User                Frontend (React)        Axios Interceptor      Backend (Express)
 │                      │                           │                     │
 ├─ Fill login form ──→ │                           │                     │
 │                      ├─ handleSubmit() ──────────┤                     │
 │                      │  authStore.login()        ├─ POST /auth/login   │
 │                      │                           ├──────────────────→  │
 │                      │                           │  {email, password}   │
 │                      │                           │                   (validate)
 │                      │                 ←─────────┼─ {token, user}      │
 │                      │ (stores in localStorage)  │                     │
 │                      │                           │                     │
 │                      │ ← Auto-redirect to /dash  │                     │
 │ Sees dashboard ←─────┤                           │                     │
 │                      ├─ fetchRecentActivity() ──┤─ + Bearer token      │
 │                      │                           ├─ GET /dashboard/recent
 │                      │                 ←─────────┼─ {recentActivity}   │
 │                      │ (displays activity)       │                     │
 │                      │                           │                     │
 │ Click logout ───────→│                           │                     │
 │                      ├─ authStore.logout() ─────┤─ POST /auth/logout   │
 │                      │ (clears localStorage)     ├──────────────────→  │
 │                      │                           │ + Bearer token       │
 │                      │                 ←─────────┼─ {message}          │
 │                      │ ← Auto-redirect to /login │                     │
 │ Sees login form ←────┤                           │                     │
```

---

## 📊 Data Model Summary

### User
```typescript
{
  id: string;
  email: string;
  name: string;
  password: string (hashed);
  role: "user" | "admin";
  createdAt: Date;
}
```

### Document
```typescript
{
  id: string;
  userId: string;
  filename: string;
  url: string;
  type: "contract" | "agreement" | "policy";
  uploadedAt: Date;
  versions: [
    {
      versionId: string;
      fileUrl: string;
      createdAt: Date;
    }
  ];
}
```

### RecentActivity
```typescript
{
  id: string;
  userId: string;
  type: "upload" | "chat" | "simplify" | "summarize" | "analyze-risk" | "compare";
  documentName: string;
  description: string;
  timestamp: Date;
}
```

### AiChat (AI History)
```typescript
{
  id: string;
  userId: string;
  documentId: string;
  question: string;
  answer: string;
  timestamp: Date;
}
```

---

## 🐛 Debugging Tips

### Backend Not Responding
```bash
# Check if backend is running
curl http://localhost:5000/api/health

# Check logs for errors
npm start  # look at console output

# Verify DATABASE_URL
cat .env | grep DATABASE_URL

# Test database connection
node -e "require('dotenv').config(); console.log(process.env.DATABASE_URL)"
```

### Frontend Can't Connect
```bash
# Check API endpoint
# In frontend/src/lib/api.ts:
// Should be: baseURL: 'http://localhost:5000/api'

# Check browser console for network errors
# DevTools → Network tab → check failed requests

# Test from terminal
curl -X GET http://localhost:5000/api/health
```

### Token Issues
```bash
# Check localStorage in browser
# DevTools → Application → LocalStorage
# Should see 'auth' key with token

# Check token validity
# Decode JWT at jwt.io
# Should have exp time in future
```

### OTP Not Sending
```bash
# Check backend/.env
cat .env | grep EMAIL

# Verify nodemailer config
# Test email sending in backend logs

# Check spam folder in email
```

---

## 📈 Performance Optimization

### Frontend
- ✅ Zustand is lighter than Redux
- ✅ Framer Motion uses GPU acceleration
- ✅ Tailwind CSS is production-optimized
- ✅ Code splitting ready (Vite)

### Backend
- ✅ MongoDB connection pooling
- ✅ JWT for stateless auth
- ✅ AI operations delegated to FastAPI

### Network
- ✅ API interceptor caches token
- ✅ 401 errors handled centrally
- ✅ FormData for file uploads

---

## 🎯 What's Left to Build

| Page | Components | Status |
|------|-----------|--------|
| Upload.tsx | File input, drag-drop, progress | ⏳ TODO |
| Documents.tsx | Document list, delete, preview | ⏳ TODO |
| Chat.tsx | Chat interface, message history | ⏳ TODO |
| History.tsx | Activity timeline | ⏳ TODO |
| Settings.tsx | Profile, preferences | ⏳ TODO |
| Navbar.tsx | Top nav, mobile menu | ⏳ Partial |

---

## ✅ Verification Checklist

Before calling it complete:

- [ ] Backend running on :5000
- [ ] Frontend running on :5173
- [ ] Can signup with OTP
- [ ] Can login
- [ ] Token persists on refresh
- [ ] Dashboard shows recent activity
- [ ] Logout works
- [ ] Sidebar navigation items clickable
- [ ] Mobile responsive
- [ ] All console errors resolved
- [ ] No network errors in DevTools
- [ ] Database has user records

---

## 📞 Support

### Common Issues

**"Cannot find module 'zustand'"**
```bash
npm install zustand
```

**"API not responding"**
- Verify backend is running: `npm start` in backend folder
- Check DATABASE_URL in .env

**"Token not persisting"**
- Check localStorage isn't disabled
- Verify persist middleware in authStore

**"CORS errors"**
- Backend should have CORS enabled
- Check backend/index.ts for cors()

---

## 🎓 Learning Resources

- **Zustand Docs:** https://github.com/pmndrs/zustand
- **Axios Docs:** https://axios-http.com/
- **Framer Motion:** https://www.framer.com/motion/
- **Tailwind CSS:** https://tailwindcss.com/
- **React Router:** https://reactrouter.com/

---

Generated: January 2024
Project: LegalSenser - AI-Powered Legal Document Assistant
