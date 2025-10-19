# summarize.py
import json
from transformers import pipeline

# -------- MODEL 1: Summarization --------
model_name = "google/flan-t5-large"
summarize_pipe = pipeline("text2text-generation", model=model_name)

def generate_summary_and_title(text: str):
    """
    Summarize the document and generate a clear title.
    Returns JSON: { "title": "...", "summary": "..." }
    """
    prompt = f"""
    You are a legal assistant.
    Summarize the following legal document into 2-3 simple and clear sentences.
    Also create a short and professional title for it.

    Return JSON ONLY in this format:
    {{
      "title": "string",
      "summary": "string"
    }}

    Document:
    {text[:5000]}
    """

    output = summarize_pipe(prompt, max_length=512, do_sample=False)[0]['generated_text']

    try:
        start, end = output.find("{"), output.rfind("}")
        if start != -1 and end != -1:
            parsed = json.loads(output[start:end + 1])
            return parsed
    except Exception:
        pass

    return {
        "title": "Legal Document Summary",
        "summary": output.strip()
    }
