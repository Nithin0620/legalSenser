#!/usr/bin/env python3
"""
Test script to verify Groq API setup and functionality.
Run this after setting up your .env file to check if everything works.
"""
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def check_api_keys():
    """Check if all 5 API keys are configured."""
    print("🔍 Checking API key configuration...\n")
    
    keys = {
        "GROQ_API_KEY_1 (Summarize)": os.getenv("GROQ_API_KEY_1"),
        "GROQ_API_KEY_2 (Risk Analysis)": os.getenv("GROQ_API_KEY_2"),
        "GROQ_API_KEY_3 (Simplify)": os.getenv("GROQ_API_KEY_3"),
        "GROQ_API_KEY_4 (Compare)": os.getenv("GROQ_API_KEY_4"),
        "GROQ_API_KEY_5 (Chat)": os.getenv("GROQ_API_KEY_5"),
    }
    
    all_valid = True
    for name, key in keys.items():
        if not key or key.startswith("gsk_your_key"):
            print(f"❌ {name}: Not configured")
            all_valid = False
        else:
            print(f"✅ {name}: Configured ({key[:15]}...)")
    
    return all_valid

def test_groq_connection():
    """Test Groq API connection with a simple call."""
    print("\n🔌 Testing Groq API connection...\n")
    
    try:
        from groq import Groq
        
        # Test with first API key
        api_key = os.getenv("GROQ_API_KEY_1")
        if not api_key or api_key.startswith("gsk_your_key"):
            print("❌ Cannot test connection - GROQ_API_KEY_1 not configured")
            return False
        
        client = Groq(api_key=api_key)
        
        # Simple test call
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": "Say 'Hello' if you can hear me."}
            ],
            max_tokens=50,
            temperature=0.3
        )
        
        answer = response.choices[0].message.content
        print(f"✅ Groq API connection successful!")
        print(f"📝 Test response: {answer}\n")
        return True
        
    except ImportError:
        print("❌ 'groq' package not installed. Run: pip install groq")
        return False
    except Exception as e:
        print(f"❌ Connection failed: {str(e)}")
        return False

def test_endpoints():
    """Test each endpoint with sample data."""
    print("🧪 Testing all endpoints...\n")
    
    sample_text = """
    This Employment Agreement is made between ABC Corp and John Doe.
    The employee shall work for a salary of $50,000 per year.
    Either party may terminate this agreement with 30 days notice.
    The company retains all intellectual property rights to work created.
    """
    
    try:
        # Test Summarize
        print("1️⃣ Testing Summarize...")
        from summarize import generate_summary_and_title
        result = generate_summary_and_title(sample_text)
        if "title" in result and "summary" in result:
            print(f"   ✅ Success: {result['title'][:50]}...")
        else:
            print(f"   ❌ Failed: {result}")
        
        # Test Risk Analysis
        print("\n2️⃣ Testing Risk Analysis...")
        from analyze_risk import analyze_risk
        result = analyze_risk(sample_text)
        if "overallRisk" in result:
            print(f"   ✅ Success: Risk Level = {result['overallRisk']}")
        else:
            print(f"   ❌ Failed: {result}")
        
        # Test Simplify
        print("\n3️⃣ Testing Simplify...")
        from simplify import simplify_document
        result = simplify_document(sample_text)
        if "simplifiedText" in result:
            print(f"   ✅ Success: Generated {len(result.get('simplifiedPoints', []))} points")
        else:
            print(f"   ❌ Failed: {result}")
        
        # Test Compare
        print("\n4️⃣ Testing Compare...")
        from compare import compare_docs
        doc2 = sample_text.replace("$50,000", "$60,000")
        result = compare_docs(sample_text, doc2)
        if "summaryPara" in result:
            print(f"   ✅ Success: Found changes")
        else:
            print(f"   ❌ Failed: {result}")
        
        # Test Chat
        print("\n5️⃣ Testing Chat...")
        from chat import chat_with_doc
        answer = chat_with_doc(sample_text, "What is the salary?")
        if answer and len(answer) > 10:
            print(f"   ✅ Success: {answer[:60]}...")
        else:
            print(f"   ❌ Failed: {answer}")
        
        print("\n✨ All endpoint tests completed!\n")
        return True
        
    except Exception as e:
        print(f"\n❌ Endpoint test failed: {str(e)}\n")
        return False

def main():
    """Run all tests."""
    print("=" * 60)
    print("🚀 LegalSenser Groq API Setup Test")
    print("=" * 60 + "\n")
    
    # Check API keys
    keys_ok = check_api_keys()
    
    if not keys_ok:
        print("\n⚠️  Please configure your API keys in .env file")
        print("   Copy .env.example to .env and add your Groq API keys")
        return
    
    # Test connection
    connection_ok = test_groq_connection()
    
    if not connection_ok:
        print("\n⚠️  Fix the connection issue before testing endpoints")
        return
    
    # Test endpoints
    test_endpoints()
    
    print("=" * 60)
    print("✅ Setup verification complete!")
    print("=" * 60)
    print("\n💡 Next step: Run the server with:")
    print("   uvicorn app:app --reload --host 0.0.0.0 --port 8000\n")

if __name__ == "__main__":
    main()
