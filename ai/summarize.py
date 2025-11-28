# summarize.py
"""
Document Summarization Module
Uses AI to generate title and summary from legal documents.
"""
import json
import re
from transformers import pipeline
from typing import Dict

# Smarter model for summarization + legal understanding
SUMMARY_MODEL = "Qwen/Qwen2.5-3B-Instruct"
_summarize_pipe = None

def _get_summarize_pipe():
    """Lazy load the summarization pipeline."""
    global _summarize_pipe
    if _summarize_pipe is None:
        _summarize_pipe = pipeline(
            "text2text-generation",
            model=SUMMARY_MODEL,
            truncation=True  # safe context handling
            # ❌ Removed device_map to avoid accelerate error on local CPU
        )
    return _summarize_pipe


def generate_summary_and_title(text: str) -> Dict:
    """
    Generate title and summary from legal document using AI reasoning.

    Args:
        text: Document text to summarize
        
    Returns:
        { "title": "...", "summary": "..." }
    """
    pipe = _get_summarize_pipe()
    truncated_text = text[:2500] if len(text) > 2500 else text

    prompt = f"""
You are a professional legal document summarizer AI.

Tasks:
1. Generate a clear, meaningful document TITLE.
2. Produce a concise, accurate SUMMARY (40–120 words).

Return strictly in JSON with this exact format:

{{
  "title": "...",
  "summary": "..."
}}

Rules:
- Do NOT repeat phrases or give anything outside JSON
- No prefixes like "Here's the summary"
- Ensure valid JSON output
- Use legal understanding for title and summary

Document Text:
{truncated_text}

JSON Output:
"""

    # Model call
    ai_raw = pipe(
        prompt,
        max_length=250,
        do_sample=False,
        temperature=0.2,
        repetition_penalty=1.3  # prevents looping & junk repeats
    )[0]['generated_text']

    # Extract JSON safely
    json_match = re.search(r'\{.*\}', ai_raw, re.DOTALL)
    if not json_match:
        return {"title": "Summary Generation Failed", "summary": ""}

    try:
        result = json.loads(json_match.group())
    except json.JSONDecodeError:
        return {"title": "Summary Generation Error", "summary": ""}

    # Safety trimming
    result["title"] = result.get("title","").strip()
    result["summary"] = result.get("summary","").strip()

    if len(result["title"]) > 65:
        result["title"] = result["title"][:62] + "..."
    if len(result["summary"]) > 500:
        result["summary"] = result["summary"][:497] + "..."

    return result
