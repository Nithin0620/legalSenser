# compare.py
"""
Document Comparison Module
Compares two document versions using AI + deterministic diffing.
"""
from transformers import pipeline
from typing import Dict, List
import difflib

# Model: Flan-T5 for generating human-readable comparison summaries
COMPARE_MODEL = "google/flan-t5-base"
_compare_pipe = None

def _get_compare_pipeline():
    """Lazy load the comparison pipeline."""
    global _compare_pipe
    if _compare_pipe is None:
        _compare_pipe = pipeline("text2text-generation", model=COMPARE_MODEL)
    return _compare_pipe

def compare_docs(old_text: str, new_text: str) -> Dict:
    """
    Compares two document versions and returns detailed analysis.
    
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
    pipe = _get_compare_pipeline()
    
    # Truncate for processing
    old_truncated = old_text[:3000] if len(old_text) > 3000 else old_text
    new_truncated = new_text[:3000] if len(new_text) > 3000 else new_text
    
    # Use difflib for deterministic line-by-line comparison
    old_lines = [line.strip() for line in old_truncated.split('.') if line.strip()]
    new_lines = [line.strip() for line in new_truncated.split('.') if line.strip()]
    
    # Get differences
    differ = difflib.Differ()
    diff = list(differ.compare(old_lines, new_lines))
    
    added = []
    removed = []
    modified = []
    
    i = 0
    while i < len(diff):
        line = diff[i]
        
        if line.startswith('+ '):
            added.append(line[2:].strip())
        elif line.startswith('- '):
            removed_text = line[2:].strip()
            # Check if next line is an addition (modification)
            if i + 1 < len(diff) and diff[i + 1].startswith('+ '):
                modified.append({
                    "old": removed_text,
                    "new": diff[i + 1][2:].strip()
                })
                i += 1  # Skip next line
            else:
                removed.append(removed_text)
        
        i += 1
    
    # Generate AI summary paragraph
    summary_prompt = f"""Compare these two document versions and describe the main changes in 2-3 sentences:

OLD: {old_truncated[:500]}

NEW: {new_truncated[:500]}

Changes summary:"""
    
    summary_para = pipe(summary_prompt, max_length=200, do_sample=False)[0]['generated_text']
    
    # Generate bullet point summary
    summary_points = []
    if added:
        summary_points.append(f"Added {len(added)} new clause(s)")
    if removed:
        summary_points.append(f"Removed {len(removed)} clause(s)")
    if modified:
        summary_points.append(f"Modified {len(modified)} existing clause(s)")
    
    # Add specific changes
    for mod in modified[:3]:
        summary_points.append(f"Changed: '{mod['old'][:50]}...' to '{mod['new'][:50]}...'")
    
    # AI impact analysis
    impact_prompt = f"""Analyze the legal impact of these document changes:

Added: {len(added)} clauses
Removed: {len(removed)} clauses
Modified: {len(modified)} clauses

Impact assessment:"""
    
    impact = pipe(impact_prompt, max_length=150, do_sample=False)[0]['generated_text']
    
    return {
        "summaryPara": summary_para.strip(),
        "summaryPoints": summary_points[:8],
        "addedClauses": added[:10],
        "removedClauses": removed[:10],
        "modifiedClauses": modified[:10],
        "impactAnalysis": impact.strip()
    }

