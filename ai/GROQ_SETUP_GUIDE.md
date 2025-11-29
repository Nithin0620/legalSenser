# LegalSenser AI - Groq API Integration Guide

## 🚀 What Changed

The application has been completely refactored to use **Groq API** instead of local transformer models. This provides:

- **Faster responses** - Cloud-based inference is much quicker
- **Better accuracy** - Using Llama 3.3 70B model for superior legal understanding
- **No GPU needed** - Everything runs via API calls
- **Rate limit avoidance** - 5 separate API keys for different functionalities

## 📋 Architecture

### 5 Dedicated API Keys
Each functionality uses its own Groq API key to avoid rate limits:

| API Key | Functionality | Endpoint |
|---------|--------------|----------|
| `GROQ_API_KEY_1` | Document Summarization | `/summarize` |
| `GROQ_API_KEY_2` | Risk Analysis | `/analyze-risk` |
| `GROQ_API_KEY_3` | Text Simplification | `/simplify` |
| `GROQ_API_KEY_4` | Document Comparison | `/compare` |
| `GROQ_API_KEY_5` | Q&A Chat | `/chat` |

### Structured Prompts
Each module now uses carefully crafted system prompts that:
- Define the exact task and output format
- Request structured JSON responses
- Include all available data (full document context)
- Specify expected output schema

### Response Format
All endpoints return structured JSON with specific fields:

**Example - Summarize Endpoint:**
```json
{
  "title": "Employment Agreement for Software Developer",
  "summary": "This is a comprehensive employment agreement..."
}
```

## 🔧 Setup Instructions

### 1. Get Groq API Keys

1. Go to [Groq Console](https://console.groq.com/keys)
2. Sign up or log in
3. Create **5 API keys** (or use the same key for all 5)
4. Copy each key

### 2. Configure Environment Variables

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

Edit `.env` and add your API keys:

```env
GROQ_API_KEY_1=gsk_your_actual_key_1_here
GROQ_API_KEY_2=gsk_your_actual_key_2_here
GROQ_API_KEY_3=gsk_your_actual_key_3_here
GROQ_API_KEY_4=gsk_your_actual_key_4_here
GROQ_API_KEY_5=gsk_your_actual_key_5_here
```

**Tip:** You can use the same API key for all 5 if you have sufficient rate limits.

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

**New dependencies:**
- `groq` - Official Groq Python SDK
- Removed: `transformers`, `torch` (no longer needed!)

### 4. Run the Application

```bash
uvicorn app:app --reload --host 0.0.0.0 --port 8000
```

## 📡 API Endpoints

### 1. Summarize Document
**POST** `/summarize`

```json
{
  "text": "Your legal document text here..."
}
```

**Response:**
```json
{
  "title": "Document Title",
  "summary": "Comprehensive summary paragraph..."
}
```

### 2. Analyze Risk
**POST** `/analyze-risk`

```json
{
  "text": "Your legal document text here..."
}
```

**Response:**
```json
{
  "overallRisk": "High",
  "riskScore": 75,
  "clauseRisks": [
    {
      "clause": "Clause text...",
      "riskLevel": "High",
      "category": "liability",
      "reasoning": "Why this is risky..."
    }
  ],
  "complianceFlags": ["GDPR concern", "Unclear jurisdiction"],
  "recommendations": [
    {
      "issue": "Problem description",
      "action": "Recommended action"
    }
  ],
  "riskFactorsPara": "Summary of all risks...",
  "riskFactorsPoints": ["Risk 1", "Risk 2", "Risk 3"]
}
```

### 3. Simplify Document
**POST** `/simplify`

```json
{
  "text": "Complex legal text here..."
}
```

**Response:**
```json
{
  "simplifiedText": "Plain English explanation...",
  "simplifiedPoints": [
    "Key point 1 in simple language",
    "Key point 2 in simple language"
  ],
  "riskHighlights": [
    {
      "text": "Risky clause...",
      "risk": "High",
      "reason": "Why it's risky in plain English"
    }
  ]
}
```

### 4. Compare Documents
**POST** `/compare`

```json
{
  "doc1": "Original document text...",
  "doc2": "Modified document text..."
}
```

**Response:**
```json
{
  "summaryPara": "Description of main changes...",
  "summaryPoints": ["Change 1", "Change 2"],
  "addedClauses": ["New clause text..."],
  "removedClauses": ["Removed clause text..."],
  "modifiedClauses": [
    {
      "old": "Original text",
      "new": "Modified text"
    }
  ],
  "impactAnalysis": "How changes affect the agreement..."
}
```

### 5. Chat with Document
**POST** `/chat`

```json
{
  "context": "Full document text...",
  "question": "What is the termination clause?",
  "history": [
    {
      "question": "Previous question",
      "answer": "Previous answer"
    }
  ]
}
```

**Response:**
```json
{
  "answer": "Direct answer to your question based on the document..."
}
```

## 🔑 Key Features of New Implementation

### 1. Comprehensive Prompts
Each API call includes:
- **System Prompt:** Defines the expert role and output format
- **User Prompt:** Contains the full document text + specific instructions
- **Response Format:** Structured JSON schema

### 2. Groq Model
Uses `llama-3.3-70b-versatile` which provides:
- Excellent legal text understanding
- Fast inference (much faster than local models)
- High token limits (up to 8000 tokens of context)

### 3. Error Handling
Fallback responses if API calls fail:
```python
if "error" in response:
    # Return meaningful fallback data
```

### 4. Token Management
Input text is truncated intelligently:
- Summarize: 8000 chars
- Risk Analysis: 10000 chars
- Simplify: 8000 chars
- Compare: 8000 chars per document
- Chat: 8000 chars

## 📊 Performance Benefits

| Aspect | Old (Transformers) | New (Groq API) |
|--------|-------------------|----------------|
| **Speed** | 10-30 seconds | 1-3 seconds |
| **RAM Usage** | 4-8 GB | < 100 MB |
| **GPU Required** | Yes (for speed) | No |
| **Model Size** | 2-5 GB download | N/A (cloud) |
| **Accuracy** | Good | Excellent |
| **Rate Limits** | None | Managed by 5 keys |

## 🛠️ Module Structure

```
LegalSenser/
├── groq_helper.py         # Core Groq API integration
│   ├── 5 API key configuration
│   ├── call_groq_api() function
│   └── System prompts for each function
│
├── summarize.py           # Uses GROQ_API_KEY_1
├── analyze_risk.py        # Uses GROQ_API_KEY_2
├── simplify.py            # Uses GROQ_API_KEY_3
├── compare.py             # Uses GROQ_API_KEY_4
├── chat.py                # Uses GROQ_API_KEY_5
│
├── app.py                 # FastAPI endpoints (unchanged)
├── requirements.txt       # Updated dependencies
└── .env.example           # API key template
```

## 🔒 Security Notes

1. **Never commit `.env` file** - It contains your API keys
2. **Rotate keys regularly** - Especially if exposed
3. **Use environment variables** - In production, set via hosting platform
4. **Monitor usage** - Check Groq console for API usage

## 🚦 Rate Limits

Groq Free Tier (per key):
- **30 requests per minute**
- **6,000 tokens per minute**

With 5 keys, you effectively have:
- **150 requests per minute**
- **30,000 tokens per minute**

## 📞 Support

If you encounter issues:
1. Check `.env` file has valid keys
2. Verify keys at [Groq Console](https://console.groq.com/keys)
3. Check Groq API status
4. Review error messages in response JSON

## 🎯 Next Steps

1. ✅ Get Groq API keys
2. ✅ Configure `.env` file
3. ✅ Install dependencies: `pip install -r requirements.txt`
4. ✅ Run the app: `uvicorn app:app --reload`
5. ✅ Test endpoints with Postman or curl

Enjoy faster, more accurate legal document analysis! 🚀
