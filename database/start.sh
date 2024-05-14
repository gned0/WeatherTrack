#!/bin/bash

# Run replica.js (initialize replica set)
mongosh < /replica.js

sleep 3

# Import json dumps
mongoimport --db weather --collection anomalies --type json --file /dumps/weather.anomalies.json --jsonArray
mongoimport --db weather --collection dataPoints --type json --file /dumps/weather.dataPoints.json --jsonArray
mongoimport --db weather --collection requests --type json --file /dumps/weather.requests.json --jsonArray
mongoimport --db weather --collection users --type json --file /dumps/weather.users.json --jsonArray
