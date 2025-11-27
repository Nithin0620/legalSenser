# summarize.py
import json
from transformers import pipeline

# Using smaller, faster model
model_name = "facebook/bart-large-cnn"
summarize_pipe = None

def _get_summarize_pipe():
    global summarize_pipe
    if summarize_pipe is None:
        summarize_pipe = pipeline("summarization", model=model_name)
    return summarize_pipe

def generate_summary_and_title(text: str):
    """
    Summarize the document and generate a clear title.
    Returns: { "title": "...", "summary": "..." }
    """
    pipe = _get_summarize_pipe()
    
    # Limit text to reasonable length for faster processing
    truncated_text = text[:2000] if len(text) > 2000 else text
    
    # Generate summary
    summary_result = pipe(truncated_text, max_length=150, min_length=40, do_sample=False)
    summary = summary_result[0]['summary_text']
    
    # Generate simple title from first sentence or words
    words = text.split()[:10]
    title = " ".join(words) + "..." if len(words) == 10 else " ".join(words)
    if len(title) > 60:
        title = title[:57] + "..."
    
    return {
        "title": title,
        "summary": summary
    }
