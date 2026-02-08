from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv

load_dotenv()

# Ensure these match the keys in your .env file
mUSERNAME = os.getenv("MONGO_USERNAME")
mPASSWORD = os.getenv("MONGO_PASSWORD")

MONGO_DETAILS = f"mongodb+srv://{mUSERNAME}:{mPASSWORD}@od-system-cluster.kqapj43.mongodb.net/?appName=OD-System-Cluster"

client = AsyncIOMotorClient(MONGO_DETAILS)
database = client.College_OD_System
od_collection = database.get_collection("od_requests")