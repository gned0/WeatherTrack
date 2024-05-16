import unittest
import json
import datetime
from pymongo import MongoClient
import os

from consumer import consumer

class TestWeatherDataProcessor(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        mongo_host = os.environ.get('MONGODB_HOST', 'localhost')
        cls.client = MongoClient('mongodb://{}:27017/'.format(mongo_host), retryWrites=False)
        cls.db = cls.client['weather']
        cls.collection = cls.db['dataPoints']

    @classmethod
    def tearDownClass(cls):
        cls.client.close()

    def test_callback(self):
        test_data = {
            'location': 'New York',
            'temperature': 25.0,
            'humidity': 60.0,
            'wind_speed': 10.0,
            'Condition': 'Clouds',
            'timestamp': '2023-03-19T12:00:00'
        }
        test_body = json.dumps(test_data).encode('utf-8')

        consumer.callback(None, None, None, test_body)

        result = self.collection.find_one({
            'location': 'New York',
            'temperature': 25.0,
            'humidity': 60.0,
            'wind_speed': 10.0,
            'Condition': 'Clouds',
            'timestamp': datetime.datetime(2023, 3, 19, 12, 0)
        })

        self.assertIsNotNone(result)

if __name__ == '__main__':
    unittest.main()
