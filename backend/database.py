from motor.motor_asyncio import AsyncIOMotorClient
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    mongodb_url: str = "mongodb://localhost:27017"
    database_name: str = "lifeos_db"

settings = Settings()

client = AsyncIOMotorClient(settings.mongodb_url)
db = client[settings.database_name]

# Collections
users_collection = db["users"]
schedules_collection = db["schedules"]
analytics_collection = db["analytics"]

async def ping_db():
    try:
        await client.admin.command('ping')
        print("Connected to MongoDB!")
    except Exception as e:
        print(f"Error connecting to MongoDB: {e}")
