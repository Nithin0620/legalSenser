# analyze_risk.py
"""
Legal Risk Analysis Module using Groq API
Performs comprehensive risk classification with compliance flags and recommendations.
"""
from groq_helper import call_groq_api, ANALYZE_RISK_SYSTEM_PROMPT
from typing import Dict, List

def analyze_risk(document_text: str) -> Dict:
    """
    Analyzes document for risks with compliance flags and recommendations using Groq API.
    
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
    # Limit document for API processing
    truncated = document_text[:10000] if len(document_text) > 10000 else document_text
    
    # Build comprehensive user prompt
    user_prompt = f"""Analyze the following legal document for risks, compliance issues, and provide recommendations.

DOCUMENT TEXT:
{truncated}

ANALYSIS REQUIREMENTS:
1. Determine the overall risk level (Low/Medium/High/Critical) and assign a risk score (0-100)
2. Identify 5-10 specific risky clauses with their risk level, category, and reasoning
3. List compliance concerns (GDPR, jurisdiction, ambiguous terms, etc.)
4. Provide 3-5 actionable recommendations with specific issues and suggested actions
5. Create a 2-3 sentence risk summary paragraph
6. List 5-7 key risk factor points

Focus on:
- Financial penalties and liabilities
- Termination and breach conditions
- Privacy and data protection issues
- Jurisdiction and governing law concerns
- Ambiguous or one-sided terms
- Indemnification clauses
- Limitation of liability
- Intellectual property rights

Be thorough and specific in your analysis."""
    
    # Call Groq API with structured output
    response = call_groq_api(
        api_name="analyze_risk",
        system_prompt=ANALYZE_RISK_SYSTEM_PROMPT,
        user_prompt=user_prompt,
        response_format={"type": "json_object"},
        temperature=0.3,
        max_tokens=3000
    )
    
    # Handle errors
    if "error" in response:
        return {
            "overallRisk": "Unknown",
            "riskScore": 0,
            "clauseRisks": [],
            "complianceFlags": [],
            "recommendations": [],
            "riskFactorsPara": f"Error analyzing risks: {response['error']}",
            "riskFactorsPoints": []
        }
    
    # Return structured response with defaults
    return {
        "overallRisk": response.get("overallRisk", "Medium"),
        "riskScore": response.get("riskScore", 50),
        "clauseRisks": response.get("clauseRisks", []),
        "complianceFlags": response.get("complianceFlags", []),
        "recommendations": response.get("recommendations", []),
        "riskFactorsPara": response.get("riskFactorsPara", "Risk analysis unavailable"),
        "riskFactorsPoints": response.get("riskFactorsPoints", [])
    }
    
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

