from sqlalchemy import Column, Integer, String, DateTime
import datetime
from database import Base

class Workout(Base):
    __tablename__ = "workouts"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    category = Column(String)
    image_url = Column(String)
    duration_min = Column(Integer)

# NEW TABLE: To store completed workouts
class ActivityLog(Base):
    __tablename__ = "activity_logs"
    id = Column(Integer, primary_key=True, index=True)
    workout_type = Column(String)
    duration = Column(Integer) # minutes
    calories = Column(Integer)
    date = Column(DateTime, default=datetime.datetime.utcnow)