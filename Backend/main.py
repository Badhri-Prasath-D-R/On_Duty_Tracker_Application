from fastapi import FastAPI
from routes import router as ODRouter
from database import client
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="College OD Management System",
    description="A digital portal for students to apply for On-Duty and staff to manage requests.",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(ODRouter, prefix="/od", tags=["On-Duty Operations"])

@app.get("/")
async def root():
    return {
        "message": "Welcome to the Digital OD Portal API",
        "status": "Online",
        "docs": "/docs"
    }

@app.get("/healthcheck")
async def health_check():
    return {"status": "Backend is running and modularized!"}

@app.get("/test-db")
async def test_db():
    try:
        await client.admin.command('ping')
        return {"status": "Successfully connected to MongoDB Atlas!"}
    except Exception as e:
        return {"status": "Connection failed", "error": str(e)}