const { server, closeServer } = require("../server");
const Data = require("../models/dataModel");
const request = require("supertest");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const config = require("../config");

const userData = {
  username: "testuser",
  password: "testpassword",
  email: "testuser@example.com",
  role: "user",
};

const adminData = {
  username: "testadmin",
  password: "testpassword",
  email: "testadmin@example.com",
  role: "admin",
};

const data = {
  location: "New York",
  attribute: "temperature",
  timespan: 2,
};

let token;

const api = request(server);

afterAll(async () => {
  await closeServer();
});

beforeEach(async () => {
  await User.deleteMany({});
  await Data.deleteMany({});

  user = await User.create(userData);
  admin = await User.create(adminData);

  token = jwt.sign({ userId: user._id }, config.JWT_SECRET, {
    expiresIn: "1h",
  });
  adminToken = jwt.sign({ userId: admin._id }, config.JWT_SECRET, {
    expiresIn: "1h",
  });

  await api.post("/data").set("Authorization", adminToken).send({
    location: "New York",
    temperature: 10,
    sensor_identifier: "testSensor",
    timestamp: new Date(),
  });

  await api.post("/data").set("Authorization", adminToken).send({
    location: "New York",
    temperature: 20,
    sensor_identifier: "testSensor",
    timestamp: new Date(),
  });
});

afterEach(async () => {
  await User.deleteMany({});
  await Data.deleteMany({});
});


describe("Data Controller", () => {
  describe("GET /data/latest", () => {
    it("should return the latest data", async () => {
      const res = await api
        .get("/data/latest")
        .set("Authorization", token)
        .query(data);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("temperature");
    });

    it("should not return the latest data without required query parameters", async () => {
      const res = await api.get("/data/latest").set("Authorization", token);

      expect(res.statusCode).toBe(400);
      expect(res.body.error).toMatch(/Missing required query parameter/);
    });
  });

  describe("GET /data/max", () => {
    it("should return the maximum data in the given timespan", async () => {
      const res = await api
        .get("/data/max")
        .set("Authorization", token)
        .query(data);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("temperature");
    });

    it("should not return the maximum data without required query parameters", async () => {
      const res = await api.get("/data/min").set("Authorization", token);

      expect(res.statusCode).toBe(400);
      expect(res.body.error).toMatch("Missing required query parameter: location");
    });

    it("should return the maximum data in the given timespan", async () => {
      const res = await api
        .get("/data/avg")
        .set("Authorization", token)
        .query(data);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("average");
    });
  });
});
