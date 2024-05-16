const mongoose = require("mongoose");
const { Server } = require("socket.io");
const Data = require("../models/dataModel");
const Anomaly = require("../models/anomalyModel");
const Not = require("../models/notificationModel");
const config = require("../config");

async function setupDataStream(io, location) {
  console.log(`Setting up data point stream for location: ${location}`);

  const dataSocket = io.of(`/data-${location}`);

  dataSocket.on("connection", (socket) => {
    console.log(
      `A user connected to the data stream for location: ${location}`
    );

    const pipeline = [
      {
        $match: {
          operationType: "insert",
          "fullDocument.location": location,
        },
      },
    ];

    const changeStream = Data.watch(pipeline);

    changeStream.on("change", (change) => {
      console.log("Change in dataPoints collection:", change);

      if (change.operationType === "insert") {
        dataSocket.emit("newData", change.fullDocument);
        console.log(
          "Emitting new data point to clients: ",
          change.fullDocument
        );
      }
    });
  });
}

async function setupAnomalyStream(io, Notification) {
  console.log("Setting up anomaly stream");

  const notifications = io.of("/notifications");
  const downtimeCache = new Map();

  notifications.on("connection", (socket) => {
    console.log("A user connected to the anomaly stream");

    const changeStream = Data.watch();

    changeStream.on("change", async (change) => {
      console.log("Change in data collection:", change);

      if (change.operationType === "insert") {
        const newDataPoint = change.fullDocument;

        const matchingNotifications = await Not.find({
          location: newDataPoint.location,
        });
        console.log("Location:", newDataPoint.location);
        console.log("Matching notifications:", matchingNotifications);

        for (const notification of matchingNotifications) {
          const { operand, threshold, attribute, userid } = notification;
          let isAnomaly = false;

          if (attribute === "temperature") {
            if (operand === "gt" && newDataPoint.temperature > threshold) {
              isAnomaly = true;
            } else if (operand === "lt" && newDataPoint.temperature < threshold) {
              isAnomaly = true;
            }
          } else if (attribute === "humidity") {
            if (operand === "gt" && newDataPoint.humidity > threshold) {
              isAnomaly = true;
            } else if (operand === "lt" && newDataPoint.humidity < threshold) {
              isAnomaly = true;
            }
          } else if (attribute === "wind_speed") {
            if (operand === "gt" && newDataPoint.wind_speed > threshold) {
              isAnomaly = true;
            } else if (operand === "lt" && newDataPoint.wind_speed < threshold) {
              isAnomaly = true;
            }
          }

          if (isAnomaly) {
            const cacheKey = `${newDataPoint.location}-${attribute}-${userid}`;
            const lastNotificationTime = downtimeCache.get(cacheKey) || 0;
            const downtime = 10 * 60 * 1000; // 10 minutes 
            console.log("Cache key:", cacheKey, "Last notification time:", lastNotificationTime, "Downtime:", downtime);
            if (Date.now() - lastNotificationTime >= downtime) {
              console.log(Date.now() - lastNotificationTime, ">", downtime, "=>", true);
              const newAnomaly = new Anomaly({
                timestamp: newDataPoint.timestamp,
                location: newDataPoint.location,
                attribute: attribute,
                value: newDataPoint[attribute],
                userid: userid,
              });

              try {
                await newAnomaly.save();
                console.log("New anomaly saved to the database:", newAnomaly);
                notifications.emit("newAnomaly", newAnomaly);
                console.log("Emitting new anomaly to clients:", newAnomaly);

                downtimeCache.set(cacheKey, Date.now());
              } catch (err) {
                console.error("Error saving anomaly to the database:", err);
              }
            } else {
              console.log(`Downtime in effect for ${cacheKey}, skipping notification.`);
            }
          }
        }
      }
    });
  });
}

module.exports = {
  setupAnomalyStream,
  setupDataStream,
};
