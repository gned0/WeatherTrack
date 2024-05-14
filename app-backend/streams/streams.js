const mongoose = require("mongoose");
const { Server } = require("socket.io");
const Data = require("../models/dataModel");
const Anomaly = require("../models/anomalyModel");
const config = require("../config");

async function setupDataStream(io, location) {
  console.log(`Setting up data point stream for location: ${location}`);

  const dataSocket = io.of(`/data-${location}`);

  dataSocket.on("connection", (socket) => {
    console.log(`A user connected to the data stream for location: ${location}`);

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
        console.log("Emitting new data point to clients: ", change.fullDocument);
      }
    });
  });
}

async function setupAnomalyStream(io) {
  console.log("Setting up anomaly stream");

  const notifications = io.of("/notifications");

  notifications.on("connection", (socket) => {
    console.log("A user connected to the anomaly stream");

    const changeStream = Anomaly.watch();

    changeStream.on("change", (change) => {
      console.log("Change in anomalies collection:", change);

      if (change.operationType === "insert") {
        notifications.emit("newAnomaly", change.fullDocument);
        console.log("Emitting new anomaly to clients: ", change.fullDocument);
      }
    });
  });
}

module.exports = {
  setupAnomalyStream,
  setupDataStream,
};
