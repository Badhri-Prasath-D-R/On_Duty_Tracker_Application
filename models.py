from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional

class ODRequest(BaseModel):
    name: str
    dept_name: str
    roll_no: str
    section: str
    reason: str
    venue: str
    status: str = "pending"
    applied_at: datetime = Field(default_factory=datetime.utcnow)

class StatusUpdate(BaseModel):
    status: str