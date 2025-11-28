from transformers import pipeline
from typing import Dict, List
import re

# Better instruction-following model for legal simplification + reasoning
SIMPLIFY_MODEL = "mistralai/Mistral-7B-Instruct-v0.2"
_simplify_pipe = None

def _get_simplify_pipeline():
    """Lazy load text generation pipeline."""
    global _simplify_pipe
    if _simplify_pipe is None:
        _simplify_pipe = pipeline(
            "text-generation",
            model=SIMPLIFY_MODEL,
            torch_dtype="auto",
            device_map="auto",
            truncation=True
        )
    return _simplify_pipe

def simplify_document(text: str) -> Dict:
    """
    AI does everything:
    - Simplifies legal text
    - Extracts key bullet points
    - Detects risky clauses
    - Classifies risk level
    - Provides AI reasoning for each highlight
    """
    pipe = _get_simplify_pipeline()
    truncated_text = text[:3500]

    # Full legal-aware prompt
    prompt = f"""
You are a legal AI assistant.

Perform the following tasks on the legal text below:

1. Rewrite the entire document into a clean, easy to understand plain English paragraph as to explain to a 5 year old child.
2. Extract 5–7 or more key points as short bullet points.
3. Identify 4–6 or multiple clauses that contain legal risk.
4. For each risky clause:
   - Return the exact text as a highlight
   - Classify risk as High / Medium / Low
   - Give a short reason WHY it is risky

Make sure your answer must be in strict JSON format like below:

{{
  "simplifiedText": "...",
  "simplifiedPoints": ["...", "..."],
  "riskHighlights": [
      {{"text": "...", "risk": "High|Medium|Low", "reason": "..."}}
  ]
}}

Legal Text:
{text}

JSON Output:
"""

    response = pipe(prompt, max_new_tokens=600, do_sample=False)[0]["generated_text"]

    # Extract JSON from model output
    json_match = re.search(r'\{.*\}', response, re.DOTALL)
    if not json_match:
        return {"simplifiedText": "", "simplifiedPoints": [], "riskHighlights": []}

    import json
    try:
        result = json.loads(json_match.group())
    except:
        return {"simplifiedText": "", "simplifiedPoints": [], "riskHighlights": []}

    return result
