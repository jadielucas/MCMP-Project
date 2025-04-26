from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import desc
from .database import get_async_session
from .models import DecibelReading, Sensor

router = APIRouter()

@router.get("/api/sensores")
async def get_sensores(session: AsyncSession = Depends(get_async_session)):
    stmt = select(Sensor)
    result = await session.execute(stmt)
    sensores = result.scalars().all()

    return [
        {
            "id": sensor.id,
            "location": sensor.location,
            "latitude": sensor.latitude,
            "longitude": sensor.longitude
        }
        for sensor in sensores
    ]

@router.get("/api/sensores/{location}/leituras")
async def get_leituras_por_local(location: str, session: AsyncSession = Depends(get_async_session)):
    # Buscar o sensor pelo "location"
    stmt_sensor = select(Sensor).where(Sensor.location == location)
    result_sensor = await session.execute(stmt_sensor)
    sensor = result_sensor.scalar_one_or_none()

    if not sensor:
        raise HTTPException(status_code=404, detail="Sensor não encontrado.")

    # Buscar leituras por sensor_id
    stmt_leituras = (
        select(DecibelReading)
        .where(DecibelReading.sensor_id == sensor.id)
        .order_by(desc(DecibelReading.timestamp))
    )
    result_leituras = await session.execute(stmt_leituras)
    leituras = result_leituras.scalars().all()

    return [
        {
            "id": leitura.id,
            "value": float(leitura.value),
            "timestamp": leitura.timestamp.isoformat()
        }
        for leitura in leituras
    ]