import pika
import json
import time
import os
import requests
import datetime
import random

time.sleep(60)
queue_name = "weather"
sensor_identifier = os.getenv("HOSTNAME")
sensor_location = os.getenv("SENSOR_LOCATION")
longitude = os.getenv("SENSOR_LONGITUDE")
latitude = os.getenv("SENSOR_LATITUDE")
frequency = int(os.getenv("FREQUENCY"))
api_key = os.getenv("API_KEY")

def getData():
    response = requests.get(f"https://api.openweathermap.org/data/2.5/weather?lat={latitude}&lon={longitude}&appid={api_key}")
    data = response.json()
    print(f"Api key: {api_key}")
    print(f"Received data: {data}")
    
    temperature = data["main"]["temp"] - 273.15
    humidity = data["main"]["humidity"]
    wind_speed = data["wind"]["speed"] * 3.6 # Convert m/s to km/h
    condition = data["weather"][0]["main"]

    current_time = datetime.datetime.now()
    formatted_timestamp = current_time.strftime("%Y-%m-%d %H:%M:%S")

    payload = {
        "timestamp": formatted_timestamp,
        "location": sensor_location,
        "sensor_identifier": sensor_identifier,
        "temperature": temperature,
        "humidity": humidity,
        "wind_speed": wind_speed,
        "condition": condition
    }

    return payload

def start_producing():

    while True:
        
        payload = getData()
        channel.basic_publish(exchange='', routing_key=queue_name, body=json.dumps(payload))
        print(f"Sent data: {payload}")
        time.sleep(frequency)

if __name__ == '__main__':
    connection = pika.BlockingConnection(pika.ConnectionParameters('rabbitmq-broker'))
    channel = connection.channel()

    channel.queue_declare(queue=queue_name)
    startup_wait = random.randint(1, 15)
    time.sleep(startup_wait)
    start_producing()