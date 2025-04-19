import paho.mqtt.client as mqtt
import json
from .database import SessionLocal
from .models import DecibelReading
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

        # Usa o loop principal para executar a tarefa assíncrona
        if main_loop:
            asyncio.run_coroutine_threadsafe(save_to_db(location, value), main_loop)
        else:
            print("⚠️ Loop principal não definido!")

        print(f"📥 Mensagem processada: {location} - {value} dB")
    except Exception as e:
        print("❌ Erro ao processar mensagem:", e)

async def save_to_db(location, value):
    async with SessionLocal() as session:
        reading = DecibelReading(location=location, value=value)
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