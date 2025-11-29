# 🚀 QUICK START GUIDE - Get Running in 3 Steps!

## Step 1: Get Your Groq API Keys (2 minutes)

1. **Go to Groq Console:** https://console.groq.com/keys
2. **Sign up or log in** (free account available)
3. **Click "Create API Key"** 
4. **Copy the key** (it starts with `gsk_`)
5. **Repeat 4 more times** to get 5 keys total (or use the same key for all 5)

## Step 2: Paste Your API Keys (1 minute)

Open the file named `.env` in this directory and replace the placeholder keys:

```env
GROQ_API_KEY_1=gsk_paste_your_first_key_here
GROQ_API_KEY_2=gsk_paste_your_second_key_here
GROQ_API_KEY_3=gsk_paste_your_third_key_here
GROQ_API_KEY_4=gsk_paste_your_fourth_key_here
GROQ_API_KEY_5=gsk_paste_your_fifth_key_here
```

**💡 Tip:** You can use the same API key for all 5 if you want!

Example (using same key):
```env
GROQ_API_KEY_1=gsk_abc123xyz789...
GROQ_API_KEY_2=gsk_abc123xyz789...
GROQ_API_KEY_3=gsk_abc123xyz789...
GROQ_API_KEY_4=gsk_abc123xyz789...
GROQ_API_KEY_5=gsk_abc123xyz789...
```

## Step 3: Run the Application (1 minute)

### Option A: Use the Automated Script (Easiest)

**On Windows:**
```bash
start.bat
```

**On Mac/Linux:**
```bash
chmod +x start.sh
./start.sh
```

### Option B: Manual Setup

```bash
# 1. Install dependencies
pip install -r requirements.txt

# 2. Test your API keys
python test_groq_setup.py

# 3. Start the server
uvicorn app:app --reload --host 0.0.0.0 --port 8000
```

## ✅ Verify It's Working

Once the server starts, you should see:
```
INFO:     Uvicorn running on http://0.0.0.0:8000
```

**Open in browser:** http://localhost:8000/docs

You'll see the interactive API documentation!

## 🧪 Test the API

Run the example script:
```bash
python example_usage.py
```

This will test all 5 endpoints with sample data!

## 📍 What You Can Do Now

| Endpoint | What It Does | Try It |
|----------|--------------|--------|
| `/summarize` | Generate title & summary | POST with legal text |
| `/analyze-risk` | Find risks & compliance issues | POST with document |
| `/simplify` | Convert to plain English | POST with complex text |
| `/compare` | Compare two document versions | POST with doc1 & doc2 |
| `/chat` | Ask questions about document | POST with context & question |

## 🆘 Troubleshooting

**Error: "Please set GROQ_API_KEY"**
- Make sure you edited the `.env` file with real keys
- Keys should start with `gsk_`
- No quotes needed around the keys

**Error: "Cannot connect to server"**
- Make sure the server is running: `uvicorn app:app --reload`
- Check if port 8000 is available

**Error: Rate limit exceeded**
- Wait a minute and try again
- This is why we use 5 different API keys!

## 📞 Need Help?

1. Check `GROQ_SETUP_GUIDE.md` for detailed documentation
2. Run `python test_groq_setup.py` to validate your setup
3. Check the terminal output for specific error messages

---

**That's it! You're ready to analyze legal documents with AI! 🎉**
