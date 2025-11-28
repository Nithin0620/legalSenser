# analyze_risk.py
"""
Legal Risk Analysis Module
Performs clause-level risk classification with compliance flags and recommendations using AI for ALL logic.
"""
import json
import re
from transformers import pipeline
from typing import Dict, List

# Upgraded reasoning + instruction model
RISK_MODEL = "meta-llama/Llama-3.1-8B-Instruct"
_risk_pipe = None


def _get_risk_pipeline():
    """Lazy load the risk analysis pipeline."""
    global _risk_pipe
    if _risk_pipe is None:
        _risk_pipe = pipeline(
            "text-generation",
            model=RISK_MODEL,
            torch_dtype="auto",
            device_map="auto",
            truncation=True
        )
    return _risk_pipe


def analyze_risk(document_text: str) -> Dict:
    """Analyzes document for legal risks using AI for all functionality."""

    pipe = _get_risk_pipeline()
    truncated = document_text[:4500] if len(document_text) > 4500 else document_text

    prompt = f"""
You are an advanced legal AI trained to analyze legal risks, classify clauses, assess compliance, and provide recommendations.

Analyze the provided document and return the response strictly in JSON using this exact schema — no extra text, no repeating phrases, no explanations outside JSON.

Required Output Format:
{{
  "overallRisk": "Low|Medium|High|Critical",
  "riskScore": 0-100,
  "clauseRisks": [
      {{"clause": "...", "riskLevel": "Low|Medium|High|Critical", "category": "penalty|liability|termination|privacy|jurisdiction", "reasoning": "..."}}
  ],
  "complianceFlags": ["...", "..."],
  "recommendations": [
      {{"issue": "...", "action": "..."}},
      {{"issue": "...", "action": "..."}},
      {{"issue": "...", "action": "..."}}
  ],
  "riskFactorsPara": "...",
  "riskFactorsPoints": ["...", "...", "..."]
}}

Rules:
1. Identify real clause risks using deep AI understanding.
2. Classify risk level and legal category intelligently.
3. Generate a numeric legal risk score (0–100) using obligation severity, liability exposure, termination power, privacy concerns, enforceability, and legal ambiguity.
4. Write a clean 2–3 sentence paragraph summarizing main legal risks (no prefixes or repeated phrases).
5. Generate 3–6 short bullet points of main risk factors.
6. Give 2–4 actionable legal recommendations.
7. If no serious clause-level risks exist, return a valid score and paragraph but keep arrays empty.

Document:
{truncated}

Now return JSON ONLY:
"""

    # AI generation call
    ai_raw = pipe(prompt, max_new_tokens=350, do_sample=False,
                  temperature=0.1, top_p=1.0, repetition_penalty=1.3)[0]["generated_text"]

    # Extract JSON block safely
    json_match = re.search(r"\{.*\}", ai_raw, re.DOTALL)
    if not json_match:
        return {
            "overallRisk": "Medium",
            "riskScore": 50,
            "clauseRisks": [],
            "complianceFlags": [],
            "recommendations": [],
            "riskFactorsPara": "Risk analysis could not be extracted clearly from model output.",
            "riskFactorsPoints": []
        }

    try:
        result = json.loads(json_match.group())
    except json.JSONDecodeError:
        return {
            "overallRisk": "Medium",
            "riskScore": 50,
            "clauseRisks": [],
            "complianceFlags": [],
            "recommendations": [],
            "riskFactorsPara": "Risk analysis JSON parsing failed due to malformed model output.",
            "riskFactorsPoints": []
        }

    # Post processing cleanup for strict formatting
    allowed_levels = ["Low", "Medium", "High", "Critical"]
    if result.get("overallRisk") not in allowed_levels:
        result["overallRisk"] = "Medium"

    if not (0 <= int(result.get("riskScore", 50)) <= 100):
        result["riskScore"] = 50

    # Trim too many list items if model overshoots
    result["clauseRisks"] = result.get("clauseRisks", [])[:10]
    result["complianceFlags"] = result.get("complianceFlags", [])[:6]
    result["recommendations"] = result.get("recommendations", [])[:6]
    result["riskFactorsPoints"] = result.get("riskFactorsPoints", [])[:7]

    # Ensure paragraph is clean from repetition loops
    result["riskFactorsPara"] = re.sub(r"(summary of legal risks.*?:)", "", result.get("riskFactorsPara","")).strip()

    return result


def _extract_clauses(text: str) -> List[str]:
    """AI based clause extraction (fallback if needed)"""
    return [text]
