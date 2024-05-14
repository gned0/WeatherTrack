import unittest
import os
from sensor import sensor

class TestWeatherDataProcessor(unittest.TestCase):

    def test_data(self):
        
        payload = sensor.getData()
        
        self.assertIn("timestamp", payload)
        self.assertIn("temperature", payload)
        self.assertIn("humidity", payload)
        self.assertEqual(payload["location"], os.getenv("SENSOR_LOCATION"))

if __name__ == '__main__':
    unittest.main()
