const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { createServer } = require("http");
const config = require("./config");
const { Server } = require("socket.io");
const { setupAnomalyStream, setupDataStream } = require("./streams/streams");
const dataModel = require("./models/dataModel");
const authRouter = require("./routes/authRoutes");
const userRouter = require("./routes/userRoutes");
const dataRouter = require("./routes/dataRoutes");
const reqRouter = require("./routes/reqRoutes");


const app = express();
const server = createServer(app);

if (process.env.MONGODB_HOST == "test-mongo") {
  uri = config.MONGO_URI_TEST;
} else {
  uri = config.MONGO_URI;
}

mongoose
  .connect(uri, {
    family: 4,
  })
  .then(() => console.log("connected to db"))
  .catch((e) => console.log(e));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(authRouter);
app.use(userRouter);
app.use(dataRouter);
app.use(reqRouter);

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

app.use((req, res) => {
  res.status(404).send({ url: req.originalUrl + " not found" });
});

server.listen(config.PORT, () => {
  console.log(`Server is running on http://localhost:${config.PORT}`);
  if (true) {
    const io = new Server(server, {
      cors: {
        origin: config.CORS_ORIGIN,
      },
    });
    setupAnomalyStream(io);

    (async () => {
      try {
        const locations = await dataModel.distinct("location");
        locations.forEach((location) => setupDataStream(io, location));
      } catch (e) {
        console.error("Error retrieving locations:", e);
      }
    })();
  }
});

module.exports = {
  server,
  closeServer: async () => {
    console.log("Closing server and MongoDB connection...");
    mongoose.connection.close();
    server.close();
  },
};
