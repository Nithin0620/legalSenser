# compare.py
import json
from transformers import pipeline

# Using text2text model for semantic comparison
compare_model_name = "google/flan-t5-large"
compare_pipe = pipeline("text2text-generation", model=compare_model_name)

def compare_docs(old_text: str, new_text: str):
    """
    Compares two documents and outputs added, removed, modified clauses.
    Returns:
      {
        "addedClauses": [...],
        "removedClauses": [...],
        "modifiedClauses": [...],
        "summary": "..."
      }
    """
    prompt = f"""
    You are a legal document comparison assistant.
    Compare the OLD document and NEW document.
    Identify added, removed, or modified clauses and assess impact.
    Return JSON ONLY in this format:
    {{
      "addedClauses": ["..."],
      "removedClauses": ["..."],
      "modifiedClauses": [
        {{"old": "...", "new": "...", "impact": "..."}}
      ],
      "summary": "..."
    }}

    OLD DOCUMENT:
    {old_text[:5000]}

    NEW DOCUMENT:
    {new_text[:5000]}
    """

    output = compare_pipe(prompt, max_length=1024, do_sample=False)[0]['generated_text']

    try:
        start, end = output.find("{"), output.rfind("}")
        if start != -1 and end != -1:
            return json.loads(output[start:end + 1])
    except Exception:
        pass

    # fallback
    return {
        "addedClauses": [],
        "removedClauses": [],
        "modifiedClauses": [],
        "summary": "Comparison could not be completed automatically."
    }

# ---------- DEMO ----------
if __name__ == "__main__":
    old_text = "Client pays within 30 days."
    new_text = "Client pays within 15 days."
    result = compare_docs(old_text, new_text)
    print(json.dumps(result, indent=2))
