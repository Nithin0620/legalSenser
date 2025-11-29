# groq_helper.py
"""
Groq API Helper Module
Manages 5 different API keys for different functionalities to avoid rate limits.
Each function gets its own dedicated API key.
"""
import os
import json
from groq import Groq
from typing import Dict, Any
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# 5 Different Groq API Keys for different functionalities
GROQ_KEYS = {
    "summarize": os.getenv("GROQ_API_KEY_1", "gsk_your_key_1_here"),
    "analyze_risk": os.getenv("GROQ_API_KEY_2", "gsk_your_key_2_here"),
    "simplify": os.getenv("GROQ_API_KEY_3", "gsk_your_key_3_here"),
    "compare": os.getenv("GROQ_API_KEY_4", "gsk_your_key_4_here"),
    "chat": os.getenv("GROQ_API_KEY_5", "gsk_your_key_5_here"),
}

# Groq client instances
_groq_clients = {}

def get_groq_client(api_name: str) -> Groq:
    """Get or create Groq client for specific API."""
    if api_name not in _groq_clients:
        api_key = GROQ_KEYS.get(api_name)
        if not api_key or api_key.startswith("gsk_your_key"):
            raise ValueError(f"Please set GROQ_API_KEY for {api_name} in environment variables or groq_helper.py")
        _groq_clients[api_name] = Groq(api_key=api_key)
    return _groq_clients[api_name]


def call_groq_api(
    api_name: str,
    system_prompt: str,
    user_prompt: str,
    response_format: Dict[str, Any] = None,
    temperature: float = 0.3,
    max_tokens: int = 2000
) -> Dict[str, Any]:
    """
    Call Groq API with structured prompts and JSON response format.
    
    Args:
        api_name: Which API key to use (summarize, analyze_risk, simplify, compare, chat)
        system_prompt: System instruction defining the task and output format
        user_prompt: User input with data to process
        response_format: Expected JSON schema (optional, for structured output)
        temperature: Sampling temperature (0.0-1.0)
        max_tokens: Maximum tokens in response
        
    Returns:
        Parsed JSON response from Groq API
    """
    client = get_groq_client(api_name)
    
    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": user_prompt}
    ]
    
    try:
        # Use llama-3.3-70b-versatile for better legal understanding
        completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=messages,
            temperature=temperature,
            max_tokens=max_tokens,
            top_p=1,
            stream=False,
            response_format={"type": "json_object"} if response_format else None,
            stop=None
        )
        
        response_text = completion.choices[0].message.content
        
        # Parse JSON response
        if response_format:
            try:
                return json.loads(response_text)
            except json.JSONDecodeError:
                # Fallback: extract JSON from response
                import re
                json_match = re.search(r'\{.*\}', response_text, re.DOTALL)
                if json_match:
                    return json.loads(json_match.group())
                else:
                    return {"error": "Failed to parse JSON response", "raw_response": response_text}
        else:
            return {"response": response_text}
            
    except Exception as e:
        return {"error": f"Groq API call failed: {str(e)}"}


# Prompt templates for each functionality

SUMMARIZE_SYSTEM_PROMPT = """You are a legal document summarization expert. Your task is to:
1. Generate a concise, clear title for the document (max 60 characters)
2. Create a comprehensive summary paragraph (100-150 words)

You MUST respond with valid JSON in this exact format:
{
    "title": "Clear document title here",
    "summary": "Detailed summary paragraph here"
}

Be professional, accurate, and focus on key points. Extract the main purpose and important details."""


ANALYZE_RISK_SYSTEM_PROMPT = """You are a legal risk analysis expert. Analyze the document and identify risks, compliance issues, and provide recommendations.

You MUST respond with valid JSON in this exact format:
{
    "overallRisk": "Low|Medium|High|Critical",
    "riskScore": 45,
    "clauseRisks": [
        {
            "clause": "Specific clause text (first 150 chars)",
            "riskLevel": "Low|Medium|High|Critical",
            "category": "penalty|liability|termination|privacy|jurisdiction|other",
            "reasoning": "Brief explanation why this is risky"
        }
    ],
    "complianceFlags": ["GDPR concern", "Jurisdiction unclear", "Ambiguous termination"],
    "recommendations": [
        {
            "issue": "Description of the issue",
            "action": "Recommended action to take"
        }
    ],
    "riskFactorsPara": "2-3 sentence paragraph summarizing all risks",
    "riskFactorsPoints": ["Risk point 1", "Risk point 2", "Risk point 3"]
}

Identify 5-10 high-risk clauses, provide specific compliance flags, and actionable recommendations."""


SIMPLIFY_SYSTEM_PROMPT = """You are a legal text simplification expert. Convert complex legal language into plain English that anyone can understand.

You MUST respond with valid JSON in this exact format:
{
    "simplifiedText": "Plain English paragraph summary (200-300 words)",
    "simplifiedPoints": [
        "Key point 1 in simple language",
        "Key point 2 in simple language",
        "Key point 3 in simple language"
    ],
    "riskHighlights": [
        {
            "text": "Original clause text (first 150 chars)",
            "risk": "High|Medium|Low",
            "reason": "Why this clause is risky in plain language"
        }
    ]
}

Provide 5-7 key points and identify 3-5 risky clauses. Use everyday language, avoid jargon."""


COMPARE_SYSTEM_PROMPT = """You are a legal document comparison expert. Compare two document versions and identify all changes.

You MUST respond with valid JSON in this exact format:
{
    "summaryPara": "2-3 sentence paragraph describing the main changes",
    "summaryPoints": [
        "Change summary 1",
        "Change summary 2",
        "Change summary 3"
    ],
    "addedClauses": [
        "New clause text that was added",
        "Another new clause"
    ],
    "removedClauses": [
        "Clause text that was removed",
        "Another removed clause"
    ],
    "modifiedClauses": [
        {
            "old": "Original clause text",
            "new": "Modified clause text"
        }
    ],
    "impactAnalysis": "Detailed analysis of how these changes affect the agreement"
}

Be thorough and highlight all significant changes. Focus on clauses that affect rights, obligations, or risks."""


CHAT_SYSTEM_PROMPT = """You are a helpful legal document assistant. Answer questions about the provided document clearly and accurately.

Rules:
- Base your answers ONLY on the provided document context
- Be direct and concise
- If information isn't in the document, say so
- Use plain language
- Consider previous conversation history if provided

Respond with a direct answer (not JSON) - just the answer text."""
