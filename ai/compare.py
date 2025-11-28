# compare.py
"""
Document Comparison Module
Compares two document versions using AI + deterministic diffing.
"""
from transformers import pipeline
from typing import Dict, List
import difflib
import re
import json

COMPARE_MODEL = "mistralai/Mistral-7B-Instruct-v0.2"
_compare_pipe = None

def _get_compare_pipeline():
    """Lazy load the comparison pipeline."""
    global _compare_pipe
    if _compare_pipe is None:
        _compare_pipe = pipeline(
            "text-generation",
            model=COMPARE_MODEL,
            torch_dtype="auto",
            device_map="auto",
            truncation=True
        )
    return _compare_pipe

def compare_docs(old_text: str, new_text: str) -> Dict:
    """
    Compares two document versions and returns detailed analysis.
    AI handles: summary, clause highlighting, legal risk levels, and impact reasoning.
    """
    pipe = _get_compare_pipeline()

    old_truncated = old_text[:3500]
    new_truncated = new_text[:3500]

    # Deterministic diffing
    old_lines = [l.strip() for l in old_truncated.split('.') if l.strip()]
    new_lines = [l.strip() for l in new_truncated.split('.') if l.strip()]

    differ = difflib.Differ()
    diff = list(differ.compare(old_lines, new_lines))

    added, removed, modified = [], [], []

    i = 0
    while i < len(diff):
        if diff[i].startswith('+ '):
            added.append(diff[i][2:].strip())
        elif diff[i].startswith('- '):
            old_line = diff[i][2:].strip()
            if i + 1 < len(diff) and diff[i + 1].startswith('+ '):
                modified.append({"old": old_line, "new": diff[i + 1][2:].strip()})
                i += 1
            else:
                removed.append(old_line)
        i += 1

    # -------------------------
    # 🔥 AI unified analysis
    # -------------------------
    prompt = f"""
You are a legal document comparison AI.

Compare OLD and NEW documents and return analysis STRICTLY in JSON:

{{
  "summaryPara": "(2–4 sentence paragraph describing major changes clearly)",
  "summaryPoints": ["(5–8 short bullet points explaining key changes one by one)"],
  "addedClauses": ["(list up to 8 added clause texts exactly)"],
  "removedClauses": ["(list up to 8 removed clause texts exactly)"],
  "modifiedClauses": [ {{"old":"...", "new":"..."}}, ... ],
  "impactAnalysis": "(brief 60–140 word legal impact reasoning)"
}}

Input data:
OLD DOCUMENT: {old_truncated}
NEW DOCUMENT: {new_truncated}

Detected diff:
Added: {added}
Removed: {removed}
Modified: {modified}

Return JSON ONLY.
JSON Output:
"""

    ai_raw = pipe(prompt, max_new_tokens=350, do_sample=False)[0]['generated_text']

    # Extract JSON safely
    match = re.search(r'\{.*\}', ai_raw, re.DOTALL)
    if not match:
        return {
            "summaryPara": "", "summaryPoints": [],
            "addedClauses": added, "removedClauses": removed,
            "modifiedClauses": modified, "impactAnalysis": ""
        }

    try:
        result = json.loads(match.group())
        # Ensure diff lists fallback if AI hallucinates empty values
        if not result.get("addedClauses"): result["addedClauses"] = added
        if not result.get("removedClauses"): result["removedClauses"] = removed
        if not result.get("modifiedClauses"): result["modifiedClauses"] = modified
        return result
    except:
        return {
            "summaryPara": "", "summaryPoints": [],
            "addedClauses": added, "removedClauses": removed,
            "modifiedClauses": modified, "impactAnalysis": ""
        }
