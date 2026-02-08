from fastapi import APIRouter, HTTPException
from database import od_collection
from models import ODRequest, StatusUpdate, LoginRequest, ODResponse
from bson import ObjectId 
from datetime import datetime
import re
from models import FacultyLoginRequest, FacultyResponse

router = APIRouter()

# Regular expression for college email validation
EMAIL_PATTERN = r"^[a-z]+\.{1}[a-z]+[0-9]{4}@citchennai\.net$"

@router.post("/auth/login")
async def login(data: LoginRequest):
    """Validates college email format and performs a mock login."""
    email = data.email.lower()

    if not re.match(EMAIL_PATTERN, email):
        raise HTTPException(
            status_code=401,
            detail="Invalid college email format. Use name.departmentYEAR@citchennai.net"
        )

    username = email.split("@")[0]
    return {
        "student_id": "STU123",
        "email": email,
        "username": username,
        "status": "login successful"
    }

@router.post("/apply")
async def apply_od(request: ODRequest):
    """Submits a new OD request to MongoDB."""
    new_od = request.model_dump()
    new_od["status"] = "pending"
    new_od["applied_at"] = datetime.utcnow()
    
    result = await od_collection.insert_one(new_od)
    if result.inserted_id:
        return {"message": "OD Request submitted!", "id": str(result.inserted_id)}
    raise HTTPException(status_code=500, detail="Failed to submit request")

@router.get("/all")
async def get_all_od():
    """Retrieves all OD requests for faculty review."""
    ods = []
    async for document in od_collection.find():
        document["_id"] = str(document["_id"]) 
        ods.append(document)
    return ods

@router.patch("/status/{request_id}")
async def update_od_status(request_id: str, update: StatusUpdate):
    """Updates the approval status of an OD request."""
    if not ObjectId.is_valid(request_id):
        raise HTTPException(status_code=400, detail="Invalid ID format")
    
    result = await od_collection.update_one(
        {"_id": ObjectId(request_id)},
        {"$set": {"status": update.status}}
    )
    
    if result.modified_count == 1:
        return {"message": f"OD status updated to {update.status}"}
    
    raise HTTPException(status_code=404, detail="Request not found")


@router.post("/auth/faculty-login")
async def faculty_login(data: FacultyLoginRequest):
    """Validates faculty credentials."""
    if data.username == "admin" and data.password == "admin123":
        return FacultyResponse(username=data.username)
    
    raise HTTPException(
        status_code=401,
        detail="Invalid faculty credentials"
    )

@router.get("/student/{roll_no}")
async def get_student_od(roll_no: str):
    """Retrieves all OD requests for a specific student by roll number."""
    ods = []
    async for document in od_collection.find({"roll_no": roll_no}):
        ods.append({
            "_id": str(document["_id"]),
            "date": document["applied_at"].strftime("%Y-%m-%d"),
            "venue": document["venue"],
            "reason": document["reason"],
            "description": document.get("description", ""),
            "status": document["status"],
            "applied_at": document["applied_at"].isoformat() if document.get("applied_at") else None
        })
    return ods

@router.get("/student/email/{email}")
async def get_student_od_by_email(email: str):
    """Retrieves all OD requests for a specific student by email."""
    ods = []
    async for document in od_collection.find({"student_email": email}):
        ods.append({
            "_id": str(document["_id"]),
            "date": document["applied_at"].strftime("%Y-%m-%d"),
            "venue": document["venue"],
            "reason": document["reason"],
            "description": document.get("description", ""),
            "status": document["status"],
            "applied_at": document["applied_at"].isoformat() if document.get("applied_at") else None
        })
    return ods