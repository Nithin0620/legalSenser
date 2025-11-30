# Backend Setup and Integration Guide

## Quick Start

### 1. Install Dependencies

Navigate to the backend directory and install all required packages:

```bash
cd backend
npm install
```

This will install:
- Express and TypeScript dependencies
- Authentication libraries (JWT, bcrypt, Google OAuth)
- Database (Mongoose)
- API client (axios) for AI service integration
- And all other required packages

### 2. Environment Configuration

Create a `.env` file in the backend directory:

```bash
cp .env.example .env
```

Update the `.env` file with your credentials:

```env
# Server
PORT=5000
ENVIRONMENT=development

# Database
MONGODB_URI=mongodb://localhost:27017/legalsenser

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_this

# Google OAuth (for Sign in with Google)
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret

# AI Service
AI_SERVICE_URL=http://localhost:8000

# Email Configuration (for OTP)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_specific_password
EMAIL_FROM=LegalSenser <noreply@legalsenser.com>
```

### 3. Google OAuth Setup (Sign in with Google)

To enable Google Sign-In:

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/

2. **Create/Select Project**
   - Create a new project or select an existing one

3. **Enable Google+ API**
   - Navigate to "APIs & Services" > "Library"
   - Search for "Google+ API"
   - Click Enable

4. **Create OAuth Credentials**
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth Client ID"
   - Choose "Web application"
   - Add authorized JavaScript origins:
     - `http://localhost:5173` (for frontend dev)
     - `http://localhost:8080` (if using different port)
   - Add authorized redirect URIs:
     - `http://localhost:5173/auth/callback`
     - Your production URL when deployed

5. **Copy Credentials**
   - Copy the Client ID
   - Paste it into your backend `.env` file as `GOOGLE_CLIENT_ID`
   - Also add it to your frontend configuration

### 4. Email Setup (Gmail for OTP)

To send OTP emails via Gmail:

1. **Enable 2-Factor Authentication**
   - Go to your Google Account: https://myaccount.google.com/
   - Navigate to Security
   - Enable 2-Step Verification

2. **Generate App Password**
   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail" as the app
   - Select "Other" as the device and name it "LegalSenser"
   - Click "Generate"
   - Copy the 16-character password

3. **Update .env File**
   ```env
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASSWORD=your_16_char_app_password
   EMAIL_FROM=LegalSenser <noreply@legalsenser.com>
   ```

**Alternative Email Providers:**
- **Outlook/Hotmail:** `smtp-mail.outlook.com` (port 587)
- **Yahoo:** `smtp.mail.yahoo.com` (port 587)
- **Custom SMTP:** Use your own SMTP server settings

### 5. Start the AI Microservice

The backend depends on the FastAPI AI service. Start it first:

```bash
cd ai
python app.py
# or
uvicorn app:app --reload
```

The AI service should be running on `http://localhost:8000`

### 5. Start MongoDB

Make sure MongoDB is running:

```bash
# If using local MongoDB
mongod

# Or use MongoDB Atlas (cloud) by updating MONGODB_URI in .env
```

### 6. Run the Backend

```bash
npm run dev
```

The server will start on `http://localhost:5000`

---

## API Integration from Frontend

### Authentication Flow

#### 1. Regular Login/Signup

```typescript
// Login
const response = await fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    uniq: 'user@example.com',
    passwordInput: 'password123'
  }),
  credentials: 'include' // Important for cookies
});

const { user, token } = await response.json();
// Store token in localStorage or use cookies
```

#### 2. Google Sign-In

```typescript
// After getting Google ID token from Google Sign-In button
const response = await fetch('http://localhost:5000/api/auth/login/google', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    idToken: googleIdToken
  }),
  credentials: 'include'
});

const { user, token } = await response.json();
```

#### 3. Making Authenticated Requests

```typescript
// Include token in Authorization header
const response = await fetch('http://localhost:5000/api/ai/simplify', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    text: 'Legal document content...'
  }),
  credentials: 'include'
});

const data = await response.json();
```

---

## AI Endpoints Usage Examples

### 1. Simplify Document

```typescript
const simplifyDocument = async (text: string, token: string) => {
  const response = await fetch('http://localhost:5000/api/ai/simplify', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ text })
  });
  
  const result = await response.json();
  // result.data contains: { title, summary, bullet_points }
  return result.data;
};
```

### 2. Summarize Document

```typescript
const summarizeDocument = async (text: string, token: string) => {
  const response = await fetch('http://localhost:5000/api/ai/summarize', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ text })
  });
  
  const result = await response.json();
  // result.data contains: { title, summary }
  return result.data;
};
```

### 3. Compare Documents

```typescript
const compareDocuments = async (doc1: string, doc2: string, token: string) => {
  const response = await fetch('http://localhost:5000/api/ai/compare', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ doc1, doc2 })
  });
  
  const result = await response.json();
  // result.data contains: { changes }
  return result.data;
};
```

### 4. Analyze Risk

```typescript
const analyzeRisk = async (text: string, token: string) => {
  const response = await fetch('http://localhost:5000/api/ai/analyze-risk', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ text })
  });
  
  const result = await response.json();
  // result.data contains: { risks, recommendations }
  return result.data;
};
```

### 5. Chat with Document

```typescript
const chatWithDocument = async (
  context: string, 
  question: string, 
  history: any[],
  token: string
) => {
  const response = await fetch('http://localhost:5000/api/ai/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ context, question, history })
  });
  
  const result = await response.json();
  // result.data contains: { answer }
  return result.data;
};
```

---

## React/TypeScript Integration Example

Create an API service file in your frontend:

```typescript
// src/services/api.ts

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

class APIService {
  private token: string | null = null;

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  getToken() {
    if (!this.token) {
      this.token = localStorage.getItem('token');
    }
    return this.token;
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const token = this.getToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'API request failed');
    }

    return response.json();
  }

  // Auth methods
  async login(uniq: string, password: string) {
    const data = await this.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ uniq, passwordInput: password }),
    });
    this.setToken(data.token);
    return data;
  }

  async googleLogin(idToken: string) {
    const data = await this.request('/api/auth/login/google', {
      method: 'POST',
      body: JSON.stringify({ idToken }),
    });
    this.setToken(data.token);
    return data;
  }

  // AI methods
  async simplifyDocument(text: string) {
    return this.request('/api/ai/simplify', {
      method: 'POST',
      body: JSON.stringify({ text }),
    });
  }

  async summarizeDocument(text: string) {
    return this.request('/api/ai/summarize', {
      method: 'POST',
      body: JSON.stringify({ text }),
    });
  }

  async compareDocuments(doc1: string, doc2: string) {
    return this.request('/api/ai/compare', {
      method: 'POST',
      body: JSON.stringify({ doc1, doc2 }),
    });
  }

  async analyzeRisk(text: string) {
    return this.request('/api/ai/analyze-risk', {
      method: 'POST',
      body: JSON.stringify({ text }),
    });
  }

  async chatWithDocument(context: string, question: string, history: any[] = []) {
    return this.request('/api/ai/chat', {
      method: 'POST',
      body: JSON.stringify({ context, question, history }),
    });
  }
}

export const apiService = new APIService();
```

---

## Testing the API

You can test the endpoints using curl or Postman:

```bash
# Test health
curl http://localhost:5000/

# Test login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"uniq":"user@example.com","passwordInput":"password123"}'

# Test AI endpoint (with token)
curl -X POST http://localhost:5000/api/ai/simplify \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"text":"This is a legal document to simplify"}'
```

---

## Troubleshooting

### Issue: "Cannot find module 'axios'"
**Solution:** Run `npm install` in the backend directory

### Issue: "AI Service connection failed"
**Solution:** Make sure the FastAPI service is running on port 8000

### Issue: "MongoDB connection failed"
**Solution:** 
- Ensure MongoDB is running
- Check MONGODB_URI in .env file

### Issue: "Google Sign-In not working"
**Solution:**
- Verify GOOGLE_CLIENT_ID is correct
- Check authorized origins in Google Cloud Console
- Ensure the ID token is being sent correctly

### Issue: "Unauthorized" on AI endpoints
**Solution:**
- Make sure you're logged in
- Include the Authorization header with JWT token
- Check if token is expired (tokens expire after 2 days)

---

## Production Deployment

Before deploying to production:

1. Update CORS origins in `index.ts`
2. Use strong JWT_SECRET
3. Use environment-specific MongoDB URI
4. Update GOOGLE_CLIENT_ID for production domain
5. Set ENVIRONMENT=production in .env
6. Use HTTPS for all endpoints

---

## Architecture

```
Frontend (React/Vite)
    ↓
Backend (Express/TypeScript)
    ↓
    ├─→ MongoDB (User data, profiles)
    └─→ AI Service (FastAPI) → Groq API (LLM)
```

All AI requests from frontend go through the backend, which:
1. Authenticates the user
2. Forwards request to AI microservice
3. Returns processed results to frontend

This architecture provides:
- Centralized authentication
- Request validation
- Error handling
- Rate limiting capability
- Unified API interface

---

## Next Steps

1. Install dependencies: `npm install`
2. Configure `.env` file
3. Set up Google OAuth credentials
4. Start MongoDB and AI service
5. Run backend: `npm run dev`
6. Test endpoints with Postman/curl
7. Integrate with frontend
