# simplify.py
import json
from transformers import pipeline

# -------- MODEL 2: Simplification --------
simplify_model_name = "google/flan-t5-large"
simplify_pipe = pipeline("text2text-generation", model=simplify_model_name)

def simplify_document(text: str):
    """
    Simplifies the given legal text into clear bullet points.
    Returns JSON: { "simplifiedPoints": ["...", "...", ...] }
    """
    prompt = f"""
    You are a legal simplification assistant.
    Simplify the following legal contract into 4-6 short bullet points.
    Each point should convey one clear obligation or term.
    Avoid legal jargon.

    Return JSON ONLY in this format:
    {{
      "simplifiedPoints": ["point1", "point2", "point3", ...]
    }}

    Document:
    {text[:5000]}
    """

    output = simplify_pipe(prompt, max_length=512, do_sample=False)[0]['generated_text']

    try:
        start, end = output.find("{"), output.rfind("}")
        if start != -1 and end != -1:
            parsed = json.loads(output[start:end + 1])
            return parsed
    except Exception:
        pass

    # Fallback in case of bad format
    lines = [line.strip("-• ") for line in output.split("\n") if line.strip()]
    return {"simplifiedPoints": lines}
