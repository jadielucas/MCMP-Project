from sqlalchemy import Column, Integer, String, Float, DateTime
from datetime import datetime
from .database import Base

class DecibelReading(Base):
    __tablename__ = "decibel_readings"

    id = Column(Integer, primary_key=True, index=True)
    location = Column(String, index=True)
    value = Column(Float)
    timestamp = Column(DateTime, default=datetime.utcnow)
    latitude = Column(Float)
    longitude = Column(Float)