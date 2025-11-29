# compare.py
"""
Document Comparison Module using Groq API
Compares two document versions and identifies all changes.
"""
from groq_helper import call_groq_api, COMPARE_SYSTEM_PROMPT
from typing import Dict, List

def compare_docs(old_text: str, new_text: str) -> Dict:
    """
    Compares two document versions and returns detailed analysis using Groq API.
    
    Args:
        old_text: Original document text
        new_text: Modified document text
        
    Returns:
        {
            "summaryPara": "Paragraph describing changes",
            "summaryPoints": ["Change 1", "Change 2", ...],
            "addedClauses": ["text that was added", ...],
            "removedClauses": ["text that was removed", ...],
            "modifiedClauses": [
                {"old": "original text", "new": "changed text"}
            ],
            "impactAnalysis": "AI assessment of changes impact"
        }
    """
    # Limit text for API processing
    old_truncated = old_text[:8000] if len(old_text) > 8000 else old_text
    new_truncated = new_text[:8000] if len(new_text) > 8000 else new_text
    
    # Build comprehensive comparison prompt
    user_prompt = f"""Compare these two versions of a legal document and identify all significant changes.

ORIGINAL DOCUMENT (Version 1):
{old_truncated}

---END OF VERSION 1---

MODIFIED DOCUMENT (Version 2):
{new_truncated}

---END OF VERSION 2---

COMPARISON REQUIREMENTS:
1. Create a 2-3 sentence paragraph summarizing the main changes between versions
2. List 5-7 key change summary points
3. Identify clauses that were ADDED in version 2 (new text not in version 1)
4. Identify clauses that were REMOVED from version 1 (text that's gone in version 2)
5. Identify clauses that were MODIFIED (changed wording between versions) - show both old and new text
6. Provide a detailed impact analysis explaining how these changes affect the agreement's terms, risks, obligations, or rights

Focus on:
- Changes to obligations, rights, and responsibilities
- Modified payment terms or penalties
- Altered termination conditions
- Changes to liability or indemnification
- New or removed restrictions
- Privacy and data handling changes
- Jurisdiction or governing law modifications

Be specific about what changed and why it matters."""
    
    # Call Groq API with structured output
    response = call_groq_api(
        api_name="compare",
        system_prompt=COMPARE_SYSTEM_PROMPT,
        user_prompt=user_prompt,
        response_format={"type": "json_object"},
        temperature=0.3,
        max_tokens=3000
    )
    
    # Handle errors
    if "error" in response:
        return {
            "summaryPara": f"Error comparing documents: {response['error']}",
            "summaryPoints": [],
            "addedClauses": [],
            "removedClauses": [],
            "modifiedClauses": [],
            "impactAnalysis": "Comparison failed due to error"
        }
    
    # Return structured response with defaults
    return {
        "summaryPara": response.get("summaryPara", "Comparison summary not available"),
        "summaryPoints": response.get("summaryPoints", []),
        "addedClauses": response.get("addedClauses", []),
        "removedClauses": response.get("removedClauses", []),
        "modifiedClauses": response.get("modifiedClauses", []),
        "impactAnalysis": response.get("impactAnalysis", "Impact analysis not available")
    }

