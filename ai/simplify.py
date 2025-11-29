# analyze_risk.py
"""
Legal Text Simplification Module using Groq API
Converts complex legal text into plain English with risk-tagged highlights.
"""
from groq_helper import call_groq_api, SIMPLIFY_SYSTEM_PROMPT
from typing import Dict, List

def simplify_document(text: str) -> Dict:
    """
    Simplifies legal text into plain English with risk-tagged highlights using Groq API.
    
    Args:
        text: Legal document text to simplify
        
    Returns:
        {
            "simplifiedText": "...",
            "simplifiedPoints": ["...", "..."],
            "riskHighlights": [
                {"text": "...", "risk": "High|Medium|Low", "reason": "..."}
            ]
        }
    """
    # Limit text for API processing
    truncated_text = text[:8000] if len(text) > 8000 else text
    
    # Build comprehensive user prompt
    user_prompt = f"""Simplify the following legal document into plain English that anyone can understand.

DOCUMENT TEXT:
{truncated_text}

SIMPLIFICATION REQUIREMENTS:
1. Create a plain English paragraph summary (200-300 words) that explains what this document is about, who the parties are, and what the main terms mean in everyday language
2. Extract 5-7 key points as bullet points in simple language - avoid legal jargon
3. Identify 3-5 risky or important clauses with:
   - The original clause text (first 150 characters)
   - Risk level (High/Medium/Low)
   - Plain English explanation of why it's risky or important

Focus on:
- Making complex terms understandable
- Highlighting obligations and restrictions
- Explaining penalties and consequences
- Clarifying rights and responsibilities
- Identifying potential risks in plain language

Use everyday words and short sentences. Avoid legal terminology unless necessary."""
    
    # Call Groq API with structured output
    response = call_groq_api(
        api_name="simplify",
        system_prompt=SIMPLIFY_SYSTEM_PROMPT,
        user_prompt=user_prompt,
        response_format={"type": "json_object"},
        temperature=0.3,
        max_tokens=2500
    )
    
    # Handle errors
    if "error" in response:
        # Fallback: extract some basic points
        sentences = [s.strip() for s in text.split('.') if len(s.strip()) > 20]
        return {
            "simplifiedText": f"Error simplifying document: {response['error']}",
            "simplifiedPoints": sentences[:5],
            "riskHighlights": []
        }
    
    # Return structured response with defaults
    return {
        "simplifiedText": response.get("simplifiedText", "Simplified text not available"),
        "simplifiedPoints": response.get("simplifiedPoints", []),
        "riskHighlights": response.get("riskHighlights", [])
    }
