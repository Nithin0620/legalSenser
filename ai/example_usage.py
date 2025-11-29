"""
Example usage of LegalSenser API with Groq integration.
This shows how to make requests to each endpoint.
"""
import requests
import json

# Base URL of your running API
BASE_URL = "http://localhost:8000"

# Sample legal document text
SAMPLE_LEGAL_TEXT = """
EMPLOYMENT AGREEMENT

This Employment Agreement ("Agreement") is entered into as of January 1, 2024, 
between TechCorp Inc. ("Company") and Jane Smith ("Employee").

1. POSITION AND DUTIES
Employee shall serve as Senior Software Engineer and shall perform such duties 
as are customarily associated with such position.

2. COMPENSATION
Company shall pay Employee a base salary of $120,000 per year, payable in 
accordance with Company's standard payroll practices.

3. BENEFITS
Employee shall be entitled to participate in all employee benefit plans maintained 
by the Company, including health insurance and 401(k).

4. TERMINATION
Either party may terminate this Agreement with 30 days written notice. Company 
may terminate immediately for cause, including breach of this Agreement or 
violation of Company policies.

5. INTELLECTUAL PROPERTY
All work product, inventions, and intellectual property created by Employee 
during employment shall be the sole property of the Company.

6. CONFIDENTIALITY
Employee agrees to maintain confidentiality of all proprietary information 
and trade secrets of the Company during and after employment.

7. NON-COMPETE
For a period of 12 months following termination, Employee shall not work for 
any direct competitor of the Company within a 50-mile radius.

8. GOVERNING LAW
This Agreement shall be governed by the laws of the State of California.
"""


def test_summarize():
    """Test the /summarize endpoint."""
    print("\n" + "="*60)
    print("1️⃣  TESTING SUMMARIZE ENDPOINT")
    print("="*60)
    
    response = requests.post(
        f"{BASE_URL}/summarize",
        json={"text": SAMPLE_LEGAL_TEXT}
    )
    
    if response.status_code == 200:
        result = response.json()
        print(f"\n✅ Success!")
        print(f"\n📌 Title: {result['title']}")
        print(f"\n📝 Summary:\n{result['summary']}")
    else:
        print(f"❌ Error: {response.status_code}")
        print(response.text)


def test_analyze_risk():
    """Test the /analyze-risk endpoint."""
    print("\n" + "="*60)
    print("2️⃣  TESTING RISK ANALYSIS ENDPOINT")
    print("="*60)
    
    response = requests.post(
        f"{BASE_URL}/analyze-risk",
        json={"text": SAMPLE_LEGAL_TEXT}
    )
    
    if response.status_code == 200:
        result = response.json()
        print(f"\n✅ Success!")
        print(f"\n⚠️  Overall Risk: {result['overallRisk']} (Score: {result['riskScore']}/100)")
        print(f"\n🚨 Compliance Flags:")
        for flag in result['complianceFlags'][:5]:
            print(f"   • {flag}")
        print(f"\n💡 Top Recommendations:")
        for rec in result['recommendations'][:3]:
            print(f"\n   Issue: {rec['issue']}")
            print(f"   Action: {rec['action']}")
    else:
        print(f"❌ Error: {response.status_code}")
        print(response.text)


def test_simplify():
    """Test the /simplify endpoint."""
    print("\n" + "="*60)
    print("3️⃣  TESTING SIMPLIFY ENDPOINT")
    print("="*60)
    
    response = requests.post(
        f"{BASE_URL}/simplify",
        json={"text": SAMPLE_LEGAL_TEXT}
    )
    
    if response.status_code == 200:
        result = response.json()
        print(f"\n✅ Success!")
        print(f"\n📖 Simplified Version:\n{result['simplifiedText'][:300]}...")
        print(f"\n📋 Key Points:")
        for i, point in enumerate(result['simplifiedPoints'][:5], 1):
            print(f"   {i}. {point}")
        print(f"\n⚠️  Risk Highlights:")
        for highlight in result['riskHighlights'][:3]:
            print(f"\n   Risk Level: {highlight['risk']}")
            print(f"   Clause: {highlight['text'][:80]}...")
            print(f"   Why: {highlight['reason']}")
    else:
        print(f"❌ Error: {response.status_code}")
        print(response.text)


def test_compare():
    """Test the /compare endpoint."""
    print("\n" + "="*60)
    print("4️⃣  TESTING COMPARE ENDPOINT")
    print("="*60)
    
    # Modified version with salary change
    modified_text = SAMPLE_LEGAL_TEXT.replace("$120,000", "$150,000")
    modified_text = modified_text.replace("30 days", "60 days")
    
    response = requests.post(
        f"{BASE_URL}/compare",
        json={
            "doc1": SAMPLE_LEGAL_TEXT,
            "doc2": modified_text
        }
    )
    
    if response.status_code == 200:
        result = response.json()
        print(f"\n✅ Success!")
        print(f"\n📊 Change Summary:\n{result['summaryPara']}")
        print(f"\n📝 Key Changes:")
        for point in result['summaryPoints']:
            print(f"   • {point}")
        print(f"\n➕ Added Clauses: {len(result['addedClauses'])}")
        print(f"➖ Removed Clauses: {len(result['removedClauses'])}")
        print(f"✏️  Modified Clauses: {len(result['modifiedClauses'])}")
        if result['modifiedClauses']:
            print(f"\n   Example modification:")
            mod = result['modifiedClauses'][0]
            print(f"   Old: {mod['old'][:80]}...")
            print(f"   New: {mod['new'][:80]}...")
    else:
        print(f"❌ Error: {response.status_code}")
        print(response.text)


def test_chat():
    """Test the /chat endpoint."""
    print("\n" + "="*60)
    print("5️⃣  TESTING CHAT ENDPOINT")
    print("="*60)
    
    questions = [
        "What is the employee's salary?",
        "How much notice is required for termination?",
        "What are the non-compete restrictions?"
    ]
    
    history = []
    
    for question in questions:
        print(f"\n❓ Question: {question}")
        
        response = requests.post(
            f"{BASE_URL}/chat",
            json={
                "context": SAMPLE_LEGAL_TEXT,
                "question": question,
                "history": history
            }
        )
        
        if response.status_code == 200:
            result = response.json()
            answer = result['answer']
            print(f"💬 Answer: {answer}")
            
            # Add to history for context
            history.append({
                "question": question,
                "answer": answer
            })
        else:
            print(f"❌ Error: {response.status_code}")
            print(response.text)


def main():
    """Run all tests."""
    print("\n" + "="*70)
    print(" 🚀 LEGALSENSER API USAGE EXAMPLES")
    print("="*70)
    print("\n📍 Make sure the server is running at:", BASE_URL)
    print("   Run: uvicorn app:app --reload")
    
    try:
        # Test health endpoint
        response = requests.get(f"{BASE_URL}/")
        if response.status_code != 200:
            print("\n❌ Server is not responding! Please start it first.")
            return
        print("✅ Server is running!\n")
        
        # Run all tests
        test_summarize()
        test_analyze_risk()
        test_simplify()
        test_compare()
        test_chat()
        
        print("\n" + "="*70)
        print("✨ All tests completed successfully!")
        print("="*70 + "\n")
        
    except requests.exceptions.ConnectionError:
        print("\n❌ Cannot connect to server!")
        print("   Please start the server first:")
        print("   uvicorn app:app --reload --host 0.0.0.0 --port 8000\n")
    except Exception as e:
        print(f"\n❌ Error: {str(e)}\n")


if __name__ == "__main__":
    main()
