from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="ELEVATE API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {"message": "Welcome to ELEVATE API!"}


@app.get("/health")
def health_check():
    return {"status": "healthy"}


@app.get("/api/test")
def test_connection():
    return {
        "message": "Hello from the ELEVATE backend!",
        "status": "connected"
    }

from pydantic import BaseModel


class QuestRequest(BaseModel):
    interests: list[str]


@app.post("/generate-quest")
def generate_quest(request: QuestRequest):
    return {
        "title": "Explore Somewhere New",
        "description": (
            "Take a 20-minute walk and discover "
            "a place you have never visited before."
        ),
        "difficulty": "Easy",
        "duration": "20 minutes",
        "category": (
            request.interests[0]
            if request.interests
            else "Exploration"
        ),
    }
