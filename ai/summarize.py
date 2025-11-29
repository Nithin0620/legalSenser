# summarize.py
"""
Document Summarization Module using Groq API
Generates title and summary for legal documents.
"""
from groq_helper import call_groq_api, SUMMARIZE_SYSTEM_PROMPT

def generate_summary_and_title(text: str):
    """
    Summarize the document and generate a clear title using Groq API.
    Returns: { "title": "...", "summary": "..." }
    """
    # Limit text to reasonable length for API processing
    truncated_text = text[:8000] if len(text) > 8000 else text
    
    # Build user prompt with the document text
    user_prompt = f"""Please analyze the following legal document and provide a title and summary.

DOCUMENT TEXT:
{truncated_text}

Generate a concise title (max 60 chars) and a comprehensive summary paragraph (100-150 words) that captures the key purpose, parties, and main terms of this document."""
    
    # Call Groq API with structured output format
    response = call_groq_api(
        api_name="summarize",
        system_prompt=SUMMARIZE_SYSTEM_PROMPT,
        user_prompt=user_prompt,
        response_format={"type": "json_object"},
        temperature=0.3,
        max_tokens=800
    )
    
    # Return response or fallback
    if "error" in response:
        # Fallback to simple extraction
        words = text.split()[:10]
        title = " ".join(words) + "..." if len(words) == 10 else " ".join(words)
        if len(title) > 60:
            title = title[:57] + "..."
        
        return {
            "title": title,
            "summary": f"Error generating summary: {response['error']}"
        }
    
    return {
        "title": response.get("title", "Untitled Document"),
        "summary": response.get("summary", "Summary not available")
    }
