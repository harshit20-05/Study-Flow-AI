from fastapi import APIRouter, HTTPException
from models import DailySchedule, ScheduleBlock
from database import schedules_collection
from typing import List
from datetime import datetime

router = APIRouter(prefix="/api/schedule", tags=["Schedule"])

@router.get("/{user_id}/{date}", response_model=DailySchedule)
async def get_schedule(user_id: str, date: str):
    doc = await schedules_collection.find_one({"user_id": user_id, "date": date})
    if doc:
        return DailySchedule(**doc)
    
    # Return empty schedule 
    return DailySchedule(user_id=user_id, date=date, blocks=[])

@router.post("/", response_model=DailySchedule)
async def save_schedule(schedule: DailySchedule):
    schedule_dict = schedule.model_dump()
    await schedules_collection.update_one(
        {"user_id": schedule.user_id, "date": schedule.date},
        {"$set": schedule_dict},
        upsert=True
    )
    return schedule
