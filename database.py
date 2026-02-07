from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv

load_dotenv()

USERNAME = os.getenv("USERNAME")
PASSWORD = os.getenv("PASSWORD")

MONGO_DETAILS = f"mongodb+srv://{USERNAME}:{PASSWORD}@od-system-cluster.kqapj43.mongodb.net/?appName=OD-System-Cluster"

client = AsyncIOMotorClient(MONGO_DETAILS)

database = client.College_OD_System

od_collection = database.get_collection("od_requests")