from fastapi import APIRouter, Depends
from sqlalchemy.future import select
from .models import DecibelReading
from .database import SessionLocal
from typing import List

router = APIRouter()

async def get_db():
    async with SessionLocal() as session:
        yield session

@router.get("/readings")
async def get_readings(db=Depends(get_db)):
    result = await db.execute(select(DecibelReading))
    return result.scalars().all()