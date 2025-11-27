# analyze_risk.py
"""
Legal Risk Analysis Module
Performs clause-level risk classification with compliance flags and recommendations.
"""
from transformers import pipeline
from typing import Dict, List
import re

# Model: Legal-BERT for classification + Flan-T5 for reasoning
RISK_MODEL = "google/flan-t5-base"
_risk_pipe = None

def _get_risk_pipeline():
    """Lazy load the risk analysis pipeline."""
    global _risk_pipe
    if _risk_pipe is None:
        _risk_pipe = pipeline("text2text-generation", model=RISK_MODEL)
    return _risk_pipe

def analyze_risk(document_text: str) -> Dict:
    """
    Analyzes document for risks with compliance flags and recommendations.
    
    Args:
        document_text: Full legal document text
        
    Returns:
        {
            "overallRisk": "Low|Medium|High|Critical",
            "riskScore": 0-100,
            "clauseRisks": [
                {
                    "clause": "extracted clause text",
                    "riskLevel": "Low|Medium|High|Critical",
                    "category": "penalty|liability|termination|privacy|jurisdiction",
                    "reasoning": "AI-generated explanation"
                }
            ],
            "complianceFlags": ["GDPR concern", "Jurisdiction unclear", ...],
            "recommendations": [
                {"issue": "description", "action": "what to do"}
            ],
            "riskFactorsPara": "Paragraph summary of all risks",
            "riskFactorsPoints": ["Risk 1", "Risk 2", ...]
        }
    """
    pipe = _get_risk_pipeline()
    
    # Truncate for processing
    truncated = document_text[:4000] if len(document_text) > 4000 else document_text
    
    # Extract clauses
    clauses = _extract_clauses(truncated)
    
    # Analyze each clause
    clause_risks = []
    risk_scores = []
    compliance_flags = set()
    
    for clause_text in clauses[:10]:  # Limit to 10 clauses
        analysis = _analyze_clause(clause_text, pipe)
        clause_risks.append(analysis['clause_risk'])
        risk_scores.append(analysis['score'])
        compliance_flags.update(analysis['compliance'])
    
    # Calculate overall risk
    avg_score = sum(risk_scores) / len(risk_scores) if risk_scores else 30
    overall_risk = _score_to_level(avg_score)
    
    # Generate recommendations
    recommendations = _generate_recommendations(clause_risks, compliance_flags, pipe)
    
    # Generate risk summary paragraph
    risk_para_prompt = f"""Summarize the main legal risks in this document in 2-3 sentences:

{truncated}

Risk summary:"""
    
    risk_para = pipe(risk_para_prompt, max_length=200, do_sample=False)[0]['generated_text']
    
    # Generate risk points
    risk_points = [cr['reasoning'] for cr in clause_risks[:6]]
    
    return {
        "overallRisk": overall_risk,
        "riskScore": int(avg_score),
        "clauseRisks": clause_risks,
        "complianceFlags": list(compliance_flags),
        "recommendations": recommendations,
        "riskFactorsPara": risk_para.strip(),
        "riskFactorsPoints": risk_points
    }

def _extract_clauses(text: str) -> List[str]:
    """Extract individual clauses from document."""
    # Split by common legal patterns
    clauses = []
    
    # Split by numbered sections
    numbered = re.split(r'\n\s*\d+\.', text)
    for section in numbered:
        if len(section.strip()) > 30:
            clauses.append(section.strip())
    
    # If no numbered sections, split by sentences
    if len(clauses) < 2:
        clauses = [s.strip() for s in text.split('.') if len(s.strip()) > 50]
    
    return clauses[:15]  # Limit clauses

def _analyze_clause(clause: str, pipe) -> Dict:
    """Analyze a single clause for risks."""
    clause_lower = clause.lower()
    
    # Risk keywords with scores
    risk_patterns = {
        'critical': (['terminate immediately', 'irrevocable', 'unlimited liability', 'no recourse'], 90),
        'high': (['penalty', 'breach', 'indemnify', 'forfeit', 'non-refundable'], 70),
        'medium': (['obligation', 'shall', 'must', 'required', 'binding', 'comply'], 45),
        'low': (['may', 'optional', 'reasonable', 'good faith'], 20)
    }
    
    score = 30  # Default
    level = "Low"
    category = "general"
    
    # Determine risk level
    for risk_level, (keywords, risk_score) in risk_patterns.items():
        for keyword in keywords:
            if keyword in clause_lower:
                score = max(score, risk_score)
                level = risk_level.capitalize()
                break
    
    # Determine category
    if any(word in clause_lower for word in ['penalty', 'fine', 'fee']):
        category = "penalty"
    elif any(word in clause_lower for word in ['liability', 'indemnify', 'damages']):
        category = "liability"
    elif any(word in clause_lower for word in ['terminate', 'cancel', 'end']):
        category = "termination"
    elif any(word in clause_lower for word in ['data', 'privacy', 'personal information']):
        category = "privacy"
    elif any(word in clause_lower for word in ['jurisdiction', 'governing law', 'court']):
        category = "jurisdiction"
    
    # AI reasoning
    reasoning_prompt = f"Explain the legal risk in this clause in one sentence: '{clause[:200]}'"
    reasoning = pipe(reasoning_prompt, max_length=50, do_sample=False)[0]['generated_text']
    
    # Check compliance
    compliance = []
    if 'data' in clause_lower or 'privacy' in clause_lower:
        compliance.append("GDPR/Privacy concern")
    if 'jurisdiction' in clause_lower and 'unclear' in reasoning.lower():
        compliance.append("Jurisdiction unclear")
    
    return {
        'clause_risk': {
            "clause": clause[:200],
            "riskLevel": level,
            "category": category,
            "reasoning": reasoning.strip()
        },
        'score': score,
        'compliance': compliance
    }

def _score_to_level(score: float) -> str:
    """Convert numeric score to risk level."""
    if score >= 80:
        return "Critical"
    elif score >= 60:
        return "High"
    elif score >= 40:
        return "Medium"
    else:
        return "Low"

def _generate_recommendations(clause_risks: List[Dict], compliance_flags: set, pipe) -> List[Dict]:
    """Generate actionable recommendations."""
    recommendations = []
    
    # High-risk clause recommendations
    high_risk_clauses = [cr for cr in clause_risks if cr['riskLevel'] in ['High', 'Critical']]
    if high_risk_clauses:
        recommendations.append({
            "issue": f"Found {len(high_risk_clauses)} high-risk clause(s)",
            "action": "Consult with legal counsel before signing"
        })
    
    # Compliance recommendations
    if "GDPR/Privacy concern" in compliance_flags:
        recommendations.append({
            "issue": "Privacy/data protection clauses detected",
            "action": "Ensure GDPR compliance and data handling procedures"
        })
    
    if "Jurisdiction unclear" in compliance_flags:
        recommendations.append({
            "issue": "Governing law or jurisdiction unclear",
            "action": "Clarify jurisdiction and applicable laws"
        })
    
    # Category-specific recommendations
    categories = [cr['category'] for cr in clause_risks]
    if 'penalty' in categories:
        recommendations.append({
            "issue": "Penalty clauses present",
            "action": "Review payment terms and penalty amounts carefully"
        })
    
    if 'liability' in categories:
        recommendations.append({
            "issue": "Liability and indemnification clauses",
            "action": "Consider liability insurance and limit exposure"
        })
    
    return recommendations[:6]  # Limit recommendations

