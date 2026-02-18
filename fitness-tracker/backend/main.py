from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
from pydantic import BaseModel

import models
from database import SessionLocal, engine

# 1. Create the database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# 2. Allow Frontend to access Backend (CORS)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 3. Database Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# 4. Pydantic Schema (Data validation)
class WorkoutSchema(BaseModel):
    id: int
    title: str
    category: str
    image_url: str
    duration_min: int

# 5. Seed Data (So the app isn't empty)
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

# 6. API Routes
@app.get("/todays-plan", response_model=List[WorkoutSchema])
def get_todays_plan(db: Session = Depends(get_db)):
    return db.query(models.Workout).all()
