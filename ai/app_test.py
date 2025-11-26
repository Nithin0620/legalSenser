from fastapi import FastAPI

app = FastAPI(title="LegalSenser AI Microservice - Test")

@app.get("/")
def root():
    return {"message": "AI microservice is running 🚀", "status": "ok"}

@app.get("/health")
def health():
    return {"status": "healthy"}
