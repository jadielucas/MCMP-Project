from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from .database import get_async_session
from .models import DecibelReading
from fastapi import HTTPException
from sqlalchemy import desc

router = APIRouter()

@router.get("/api/sensores")
async def get_sensores(session: AsyncSession = Depends(get_async_session)):
    stmt = select(DecibelReading)
    result = await session.execute(stmt)
    sensores = result.scalars().all()

    # Incluindo latitude e longitude no retorno
    return [
        {"id": leitura.id, "local": leitura.location, "latitude": leitura.latitude, "longitude": leitura.longitude}
        for leitura in sensores
    ]

@router.get("/api/sensores/{location}/leituras")
async def get_leituras_por_local(location: str, session: AsyncSession = Depends(get_async_session)):
    stmt = select(DecibelReading).where(DecibelReading.location == location).order_by(desc(DecibelReading.timestamp))
    result = await session.execute(stmt)
    leituras = result.scalars().all()

    if not leituras:
        raise HTTPException(status_code=404, detail="Nenhuma leitura encontrada para este local.")

    return [
        {
            "id": leitura.id,
            "valor": leitura.value,
            "timestamp": leitura.timestamp.isoformat()
        }
        for leitura in leituras
    ]