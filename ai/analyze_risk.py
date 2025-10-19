# analyze_risk.py
import json
from transformers import pipeline

# Using a text2text model for risk analysis
risk_model_name = "google/flan-t5-large"
risk_pipe = pipeline("text2text-generation", model=risk_model_name)

def analyze_risk(document_text: str, document_type: str = "pdf"):
    """
    Analyzes the document for risk per clause and provides recommendations.
    Input:
      document_text: full text of the document
      document_type: "pdf" | "docx" | "image"
    Returns:
      {
        "overallRiskLevel": "...",
        "clauseRisks": [...],
        "recommendations": [...]
      }
    """
    prompt = f"""
    You are a legal risk analysis assistant.
    Analyze the following contract/document text for risk exposure.
    For each clause, output:
      - clause name
      - risk level (Low, Medium, High)
      - reason for risk level

    Also provide overall risk level of the document and top recommendations to mitigate risks.

    Return JSON ONLY in this format:
    {{
      "overallRiskLevel": "...",
      "clauseRisks": [
        {{"clause": "...", "riskLevel": "...", "reason": "..."}}
      ],
      "recommendations": ["...", "..."]
    }}

    Document ({document_type}):
    {document_text[:7000]}
    """

    output = risk_pipe(prompt, max_length=1024, do_sample=False)[0]['generated_text']

    try:
        start, end = output.find("{"), output.rfind("}")
        if start != -1 and end != -1:
            return json.loads(output[start:end + 1])
    except Exception:
        pass

    # fallback
    return {
        "overallRiskLevel": "Medium",
        "clauseRisks": [{"clause": "General", "riskLevel": "Medium", "reason": output.strip()}],
        "recommendations": ["Review document with legal expert."]
    }

# ---------- DEMO ----------
if __name__ == "__main__":
    sample_text = "Payment must be made within 30 days. Late payment incurs 10% penalty."
    result = analyze_risk(sample_text)
    print(json.dumps(result, indent=2))
