from fastapi import APIRouter, HTTPException
from database import od_collection
from models import ODRequest, StatusUpdate
from bson import ObjectId 
from datetime import datetime

router = APIRouter()

@router.post("/apply")
async def apply_od(request: ODRequest):
    new_od = request.dict()
    result = await od_collection.insert_one(new_od)
    if result.inserted_id:
        return {"message": "OD Request submitted!", "id": str(result.inserted_id)}
    raise HTTPException(status_code=500, detail="Failed to submit request")

@router.get("/all")
async def get_all_od():
    ods = []
    async for document in od_collection.find():
        document["_id"] = str(document["_id"]) 
        ods.append(document)
    return ods

@router.patch("/status/{request_id}")
async def update_od_status(request_id: str, update: StatusUpdate):
    if not ObjectId.is_valid(request_id):
        raise HTTPException(status_code=400, detail="Invalid ID format")
    
    result = await od_collection.update_one(
        {"_id": ObjectId(request_id)},
        {"$set": {"status": update.status}}
    )
    
    if result.modified_count == 1:
        return {"message": f"OD status updated to {update.status}"}
    
    raise HTTPException(status_code=404, detail="Request not found or no change made")