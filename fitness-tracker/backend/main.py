from passlib.context import CryptContext
from fastapi import HTTPException, FastAPI, Depends
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
    allow_origins=["*"],
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

# --- SCHEMAS ---

class WorkoutSchema(BaseModel):
    id: int
    title: str
    category: str
    image_url: str
    duration_min: int

class ActivityLogCreate(BaseModel):
    workout_type: str
    duration: int
    calories: int

# Schema to send history back to React
class ActivityLogSchema(BaseModel):
    id: int
    workout_type: str
    duration: int
    calories: int
    date: datetime

    class Config:
        from_attributes = True

# --- AUTHENTICATION SETUP ---

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class UserCreate(BaseModel):
    username: str
    password: str

@app.post("/signup")
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    # Check if user already exists
    db_user = db.query(models.User).filter(models.User.username == user.username).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    
    # Hash password and save
    hashed_password = pwd_context.hash(user.password)
    new_user = models.User(username=user.username, password_hash=hashed_password)
    db.add(new_user)
    db.commit()
    return {"message": "User created successfully"}

@app.post("/login")
def login_user(user: UserCreate, db: Session = Depends(get_db)):
    # Find user in DB
    db_user = db.query(models.User).filter(models.User.username == user.username).first()
    if not db_user:
        raise HTTPException(status_code=400, detail="Invalid username or password")
    
    # Verify password
    if not pwd_context.verify(user.password, db_user.password_hash):
        raise HTTPException(status_code=400, detail="Invalid username or password")
        
    return {"message": "Login successful", "username": db_user.username}

# --- MAIN APP ROUTES ---

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

@app.post("/log-workout")
def log_workout(log: ActivityLogCreate, db: Session = Depends(get_db)):
    new_log = models.ActivityLog(
        workout_type=log.workout_type,
        duration=log.duration,
        calories=log.calories # <- Fixed the typo here!
    )
    db.add(new_log)
    db.commit()
    db.refresh(new_log)
    return {"message": "Workout saved successfully!"}

@app.get("/my-history", response_model=List[ActivityLogSchema])
def get_my_history(db: Session = Depends(get_db)):
    # Returns the 5 most recent workouts for the progress tab
    return db.query(models.ActivityLog).order_by(models.ActivityLog.date.desc()).limit(5).all()