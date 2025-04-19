from sqlalchemy import Column, Integer, Float, String, DateTime
from datetime import datetime
from .database import Base

class DecibelReading(Base):
    __tablename__ = "readings"

    id = Column(Integer, primary_key=True, index=True)
    location = Column(String)
    value = Column(Float)
    timestamp = Column(DateTime, default=datetime.utcnow)