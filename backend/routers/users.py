from fastapi import APIRouter
from models import UserProfile
from database import users_collection

router = APIRouter(prefix="/api/users", tags=["Users"])

@router.get("/{user_id}", response_model=UserProfile)
async def get_user(user_id: str):
    doc = await users_collection.find_one({"_id": user_id})
    if doc:
        doc["name"] = doc.pop("_id")
        return UserProfile(**doc)
    return None

@router.post("/")
async def save_user(profile: UserProfile):
    prof_dict = profile.model_dump()
    user_id = prof_dict.get("name", "Optimizer")
    await users_collection.update_one(
        {"_id": user_id},
        {"$set": prof_dict},
        upsert=True
    )
    return {"message": "User saved"}
