from pydantic import BaseModel, Field, EmailStr
from datetime import datetime
from typing import List

# Model for student login
class LoginRequest(BaseModel):
    email: EmailStr

# Updated OD Request model with email and description
class ODRequest(BaseModel):
    student_email: EmailStr
    name: str
    dept_name: str
    roll_no: str
    section: str
    reason: str
    venue: str
    description: str
    status: str = "pending"
    applied_at: datetime = Field(default_factory=datetime.utcnow)

# Response model for individual OD records
class ODResponse(BaseModel):
    date: str
    venue: str
    reason: str
    status: str

class StatusUpdate(BaseModel):
    status: str

# Add this to your models.py file

# Model for faculty login
class FacultyLoginRequest(BaseModel):
    username: str
    password: str

# Faculty response model
class FacultyResponse(BaseModel):
    username: str
    role: str = "faculty"
    status: str = "login successful"