# ai_legal_simplify.py
import json
from summarize import generate_summary_and_title
from simplify import simplify_document

def analyze_contract(text: str):
    """
    Combines title + summary + simplified points.
    Returns:
    {
      "title": "...",
      "summary": "...",
      "simplifiedPoints": ["...", "...", ...]
    }
    """
    summary_data = generate_summary_and_title(text)
    simplified = simplify_document(text)

    return {
        "title": summary_data.get("title", "Untitled Document"),
        "summary": summary_data.get("summary", ""),
        "simplifiedPoints": simplified.get("simplifiedPoints", [])
    }

# ---------- DEMO ----------
if __name__ == "__main__":
    sample_text = """
    This Agreement is made between ABC Pvt Ltd and XYZ Corp. Payment shall be made within 30 days of invoice.
    In case of late payment, a penalty of 10% will be applied. Either party may terminate the contract with 30 days’ notice.
    """
    result = analyze_contract(sample_text)
    print(json.dumps(result, indent=2))
