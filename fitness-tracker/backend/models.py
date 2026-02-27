from sqlalchemy import Column, Integer, String
from database import Base

class Workout(Base):
    __tablename__ = "workouts"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    category = Column(String)
    image_url = Column(String)
    duration_min = Column(Integer)