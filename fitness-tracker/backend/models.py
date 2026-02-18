from sqlalchemy import Column, Integer, String, Boolean
from database import Base

class Workout(Base):
    __tablename__ = "workouts"

    id = Integer, primary_key=True, index=True
    title = String, index=True
    category = String
    image_url = String # We will use emojis or placeholders for now
    duration_min = Integer