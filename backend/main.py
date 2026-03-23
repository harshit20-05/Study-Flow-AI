from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import ping_db
import routers.schedule as schedule
import routers.users as users
import routers.ml as ml
import routers.auth as auth

app = FastAPI(title="LifeOS API")

# Configure CORS for frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_db_client():
    await ping_db()

app.include_router(auth.router)
app.include_router(schedule.router)
app.include_router(users.router)
app.include_router(ml.router)

@app.get("/")
def read_root():
    return {"status": "ok", "message": "LifeOS API is running"}

