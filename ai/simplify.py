# simplify.py
"""
Legal Text Simplification Module
Uses AI to convert complex legal text into plain English with risk-tagged highlights.
"""
from transformers import pipeline
from typing import Dict, List
import re

# Model: Flan-T5 for text simplification
SIMPLIFY_MODEL = "google/flan-t5-base"
_simplify_pipe = None

def _get_simplify_pipeline():
    """Lazy load the simplification pipeline."""
    global _simplify_pipe
    if _simplify_pipe is None:
        _simplify_pipe = pipeline("text2text-generation", model=SIMPLIFY_MODEL)
    return _simplify_pipe

def simplify_document(text: str) -> Dict:
    """
    Simplifies legal text into plain English with risk-tagged highlights.
    
    Args:
        text: Legal document text to simplify
        
    Returns:
        {
            "simplifiedText": "Plain English paragraph summary",
            "simplifiedPoints": ["Point 1", "Point 2", ...],
            "riskHighlights": [
                {"text": "clause text", "risk": "High|Medium|Low", "reason": "why risky"}
            ]
        }
    """
    pipe = _get_simplify_pipeline()
    
    # Truncate text for processing
    truncated_text = text[:3000] if len(text) > 3000 else text
    
    # Generate simplified paragraph
    simplify_prompt = f"""Simplify this legal text into plain English. Remove jargon:

{truncated_text}

Plain English version:"""
    
    simplified_para = pipe(simplify_prompt, max_length=300, min_length=50, do_sample=False)[0]['generated_text']
    
    # Generate bullet points
    points_prompt = f"""List key points from this text as 5-7 bullet points:

{truncated_text}

Points:"""
    
    points_raw = pipe(points_prompt, max_length=400, do_sample=False)[0]['generated_text']
    
    # Parse bullet points
    points = []
    for line in points_raw.split('\n'):
        cleaned = re.sub(r'^[-•*\d.)\s]+', '', line).strip()
        if cleaned and len(cleaned) > 10:
            points.append(cleaned)
    
    if len(points) < 3:
        sentences = [s.strip() for s in truncated_text.split('.') if len(s.strip()) > 20]
        points = sentences[:6]
    
    # Extract risk highlights
    risk_highlights = _extract_risk_highlights(truncated_text, pipe)
    
    return {
        "simplifiedText": simplified_para.strip(),
        "simplifiedPoints": points[:7],
        "riskHighlights": risk_highlights
    }

def _extract_risk_highlights(text: str, pipe) -> List[Dict]:
    """Extract risky clauses with AI reasoning."""
    high_risk_terms = ['penalty', 'terminate', 'breach', 'liability', 'indemnif', 'forfeit']
    medium_risk_terms = ['obligation', 'shall', 'must', 'binding']
    
    highlights = []
    sentences = [s.strip() for s in text.split('.') if s.strip()]
    
    for sentence in sentences[:10]:
        sentence_lower = sentence.lower()
        
        for term in high_risk_terms:
            if term in sentence_lower and len(sentence) > 20:
                reason_prompt = f"Why is this clause risky? '{sentence[:100]}' Answer briefly:"
                reason = pipe(reason_prompt, max_length=30, do_sample=False)[0]['generated_text']
                
                highlights.append({
                    "text": sentence[:150],
                    "risk": "High",
                    "reason": reason.strip()
                })
                break
        else:
            for term in medium_risk_terms:
                if term in sentence_lower and len(sentence) > 20:
                    highlights.append({
                        "text": sentence[:150],
                        "risk": "Medium",
                        "reason": "Contains binding obligations"
                    })
                    break
        
        if len(highlights) >= 5:
            break
    
    return highlights
