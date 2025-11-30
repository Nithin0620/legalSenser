# LegalSenser Backend API

Backend server for LegalSenser - A legal document analysis platform with AI capabilities.

## Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB
- Python FastAPI microservice running (for AI features)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```bash
cp .env.example .env
```

3. Configure environment variables in `.env`:
   - MongoDB connection string
   - JWT secret
   - Google OAuth credentials
   - AI service URL
   - Twilio credentials (for OTP)

### Running the Server

Development mode:
```bash
npm run dev
```

The server will start on `http://localhost:5000`

## API Endpoints

### Authentication Endpoints

#### POST `/api/auth/sendotp`
Send OTP to email for signup
```json
{
  "email": "user@example.com"
}
```

#### POST `/api/auth/signup`
Signup with OTP verification (sent to email)
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "mobileNo": "1234567890",
  "password": "securePassword123",
  "otpInput": "123456"
}
```

**Note:** OTP is sent to the email address. Mobile number is optional.

#### POST `/api/auth/login`
Login with email/mobile and password
```json
{
  "uniq": "john@example.com",
  "passwordInput": "securePassword123"
}
```

#### POST `/api/auth/login/google`
Login with Google OAuth
```json
{
  "idToken": "google_id_token_here"
}
```

#### POST `/api/auth/logout`
Logout current user (clears JWT cookie)

#### POST `/api/auth/checkauth`
Check authentication status (requires JWT token)

---

### AI Endpoints (All require authentication)

#### POST `/api/ai/simplify`
Simplify legal document into easy-to-understand language
```json
{
  "text": "Legal document content here..."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Document simplified successfully",
  "data": {
    "title": "Generated title",
    "summary": "Summary paragraph",
    "bullet_points": ["Point 1", "Point 2", "..."]
  }
}
```

#### POST `/api/ai/summarize`
Generate summary and title for document
```json
{
  "text": "Document content here..."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Document summarized successfully",
  "data": {
    "title": "Generated title",
    "summary": "Summary content"
  }
}
```

#### POST `/api/ai/compare`
Compare two documents and identify changes
```json
{
  "doc1": "First document content...",
  "doc2": "Second document content..."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Documents compared successfully",
  "data": {
    "changes": "Summary of changes between documents"
  }
}
```

#### POST `/api/ai/analyze-risk`
Analyze document for potential risks
```json
{
  "text": "Document content here..."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Risk analysis completed successfully",
  "data": {
    "risks": ["Risk 1", "Risk 2", "..."],
    "recommendations": ["Recommendation 1", "Recommendation 2", "..."]
  }
}
```

#### POST `/api/ai/chat`
Q&A with document context
```json
{
  "context": "Document content for context...",
  "question": "Your question here?",
  "history": []
}
```

**Response:**
```json
{
  "success": true,
  "message": "Chat response generated successfully",
  "data": {
    "answer": "AI-generated answer based on document context"
  }
}
```

---

## Authentication

All AI endpoints require authentication. Include the JWT token in your requests:

**Header:**
```
Authorization: Bearer <your_jwt_token>
```

Or use cookies (automatically set after login).

---

## Error Handling

All endpoints return errors in the following format:
```json
{
  "success": false,
  "message": "Error message description"
}
```

Common HTTP status codes:
- `200` - Success
- `400` - Bad Request (missing/invalid parameters)
- `401` - Unauthorized (not authenticated)
- `404` - Not Found
- `500` - Internal Server Error

---

## Google Sign-In Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs
6. Copy Client ID and add to `.env`

---

## AI Microservice Integration

The backend connects to a FastAPI microservice for AI operations. Ensure the AI service is running and configure the `AI_SERVICE_URL` in your `.env` file.

Default: `http://localhost:8000`

---

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── dbConnect.ts
│   ├── controller/
│   │   ├── auth.ts
│   │   ├── handleAi.ts
│   │   └── ...
│   ├── middlewares/
│   │   └── ProtectRoute.ts
│   ├── models/
│   │   ├── user.ts
│   │   ├── profile.ts
│   │   └── ...
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   ├── ai.routes.ts
│   │   └── ...
│   └── services/
│       └── aiService.ts
├── index.ts
├── package.json
└── tsconfig.json
```

---

## Dependencies

Key packages:
- `express` - Web framework
- `mongoose` - MongoDB ODM
- `jsonwebtoken` - JWT authentication
- `bcrypt` - Password hashing
- `google-auth-library` - Google OAuth
- `axios` - HTTP client for AI service
- `nodemailer` - Email service for OTP
- `otp-generator` - Generate OTP codes
- `multer` - File uploads
- `cors` - CORS handling

---

## Email Setup

The app uses Nodemailer to send OTP codes via email. See `EMAIL_SETUP.md` for detailed configuration instructions.

Quick setup:
1. Enable 2FA on Gmail
2. Generate App Password
3. Add credentials to `.env`

---

## License

MIT
