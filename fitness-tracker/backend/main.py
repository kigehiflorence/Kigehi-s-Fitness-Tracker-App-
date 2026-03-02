from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
from pydantic import BaseModel
from datetime import datetime

import models
from database import SessionLocal, engine

# Creates tables in SQLite
models.Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

class WorkoutSchema(BaseModel):
    id: int
    title: str
    category: str
    image_url: str
    duration_min: int

# NEW: Schema for incoming workout data
class ActivityLogCreate(BaseModel):
    workout_type: str
    duration: int
    calories: int

@app.on_event("startup")
def startup_event():
    db = SessionLocal()
    if db.query(models.Workout).count() == 0:
        sample_workouts = [
            models.Workout(title="Shoulder Bridge", category="Pilates", image_url="🧘‍♀️", duration_min=10),
            models.Workout(title="Teaser (V-Sit)", category="Core", image_url="🤸‍♀️", duration_min=15),
            models.Workout(title="Side Plank", category="Strength", image_url="💪", duration_min=5),
            models.Workout(title="Cat-Cow", category="Flexibility", image_url="🐈", duration_min=8),
            models.Workout(title="Swan Prep", category="Back", image_url="🦢", duration_min=12),
            models.Workout(title="Criss Cross", category="Cardio", image_url="❌", duration_min=20),
        ]
        db.add_all(sample_workouts)
        db.commit()
    db.close()

@app.get("/todays-plan", response_model=List[WorkoutSchema])
def get_todays_plan(db: Session = Depends(get_db)):
    return db.query(models.Workout).all()

# NEW API ROUTE: Receives data from React and saves to SQLite
@app.post("/log-workout")
def log_workout(log: ActivityLogCreate, db: Session = Depends(get_db)):
    new_log = models.ActivityLog(
        workout_type=log.workout_type,
        duration=log.duration,
        calories=log.calories
    )
    db.add(new_log)
    db.commit()
    db.refresh(new_log)
    return {"message": "Workout saved successfully!"}