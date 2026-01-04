from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from .model_loader import detector
from .schemas import ContentCheckRequest
import os

app = FastAPI(title="WorkSphere Hate Speech Detection API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    model_path = os.path.join("models", "WorkSphere_labse_Model")
    tokenizer_path = os.path.join("models", "WorkSphere_labse_Model_tokenizer")
    detector.load_model(model_path, tokenizer_path)

@app.post("/api/check-content")
async def check_content(request: ContentCheckRequest):
    try:
        result = detector.predict(request.text, request.threshold)
        return {
            "success": True,
            "data": result,
            "message": "Content analyzed successfully"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    return {"status": "healthy", "model_loaded": detector.loaded}