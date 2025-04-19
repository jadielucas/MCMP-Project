from fastapi import FastAPI
from . import api, mqtt
from .models import Base
from .database import engine
import asyncio

app = FastAPI()
app.include_router(api.router)

@app.on_event("startup")
async def startup():
    # Cria as tabelas no banco de dados
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    # Obtém o event loop principal e inicia o MQTT
    loop = asyncio.get_event_loop()
    mqtt.start_mqtt(loop)