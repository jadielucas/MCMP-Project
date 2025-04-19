import uvicorn
from app import mqtt

if __name__ == "__main__":
    mqtt.start_mqtt()
    uvicorn.run("app.main:app", host="localhost", port=8000, reload=True)