from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class ScheduleBlock(BaseModel):
    id: int
    hour: int
    duration: int
    type: str
    title: str
    done: bool = False

class DailySchedule(BaseModel):
    user_id: str
    date: str
    blocks: List[ScheduleBlock]
    completion_pct: int = 0
    burnout_risk: int = 0
    created_at: datetime = Field(default_factory=datetime.utcnow)

class UserProfile(BaseModel):
    name: str
    goals: List[str]
    wakeTime: str
    sleepTime: str
    availableHours: int
    energyPeak: str
    routineStyle: str
