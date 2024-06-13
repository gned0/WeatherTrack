import pika
import json
import time
from pymongo import MongoClient
import datetime
import os

print("Waiting for message broker startup")
time.sleep(60)
mongo_host = os.environ.get('MONGODB_HOST', 'mongodb://localhost:27017/')
client = MongoClient(mongo_host, retryWrites=False)
db = client['weather']
collection = db['dataPoints']

queue_name = "weather"

def callback(ch, method, properties, body):
    data = json.loads(body.decode('utf-8'))
    print(f"Received message: {data}")

    timestamp = datetime.datetime.fromisoformat(data['timestamp'])
    data['timestamp'] = timestamp

    existing_document = collection.find_one({'timestamp': data['timestamp'], 'location': data['location']})
    if existing_document:
        print(f"Document with timestamp {data['timestamp']} and location {data['location']} already exists. Skipping insert.")
    else:
        collection.insert_one(data)
        print(f"Inserted document: {data}")

def start_consuming():
    connection = pika.BlockingConnection(pika.ConnectionParameters('rabbitmq-broker'))
    channel = connection.channel()

    channel.queue_declare(queue=queue_name)

    channel.basic_consume(queue=queue_name, on_message_callback=callback, auto_ack=True)

    print('Waiting for messages. To exit press CTRL+C')
    channel.start_consuming()

if __name__ == '__main__':
    start_consuming()
    