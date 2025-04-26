import paho.mqtt.client as mqtt
import json
from .database import SessionLocal
from .models import DecibelReading
from .models import Sensor
from sqlalchemy import select
import asyncio

MQTT_BROKER = "localhost"
MQTT_TOPIC = "sensor/sound/pico"

# Armazena o loop principal aqui
main_loop = None

def on_connect(client, userdata, flags, rc):
    print("✅ Conectado ao MQTT com código", rc)
    client.subscribe(MQTT_TOPIC)

def on_message(client, userdata, msg):
    try:
        payload = json.loads(msg.payload.decode())
        location = payload.get("location")
        value = payload.get("value")
        latitude = payload.get("latitude")
        longitude = payload.get("longitude")

        if main_loop:
            asyncio.run_coroutine_threadsafe(
                save_to_db(location, value, latitude, longitude), main_loop
            )
        else:
            print("⚠️ Loop principal não definido!")

        print(f"📥 Mensagem processada: {location} - {value} dB")
    except Exception as e:
        print("❌ Erro ao processar mensagem:", e)

async def save_to_db(location, value, latitude=None, longitude=None):
    async with SessionLocal() as session:
        # Verifica se o sensor já existe pelo "location"
        result = await session.execute(
            select(Sensor).where(Sensor.location == location)
        )
        sensor = result.scalar_one_or_none()

        if not sensor:
            # Se não existir, cria o sensor
            sensor = Sensor(
                location=location,
                latitude=latitude,
                longitude=longitude
            )
            session.add(sensor)
            await session.commit()
            await session.refresh(sensor)  # Pega o id gerado

        # Agora cria a leitura associada ao sensor
        reading = DecibelReading(
            sensor_id=sensor.id,
            value=float(value)
        )
        session.add(reading)
        await session.commit()

def start_mqtt(loop):
    global main_loop
    main_loop = loop  # Define o loop principal a ser usado

    client = mqtt.Client()
    client.on_connect = on_connect
    client.on_message = on_message
    client.connect(MQTT_BROKER, 1883, 60)
    client.loop_start()