const { server, closeServer } = require("../server");
const Request = require("../models/requestModel");
const User = require("../models/userModel");
const request = require("supertest");
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

let user;
let admin;
let userToken;
let adminToken;

const api = request(server);

afterAll(async () => {
  await User.deleteMany({});
  await Request.deleteMany({});
  await closeServer();
});

beforeAll(async () => {
  await User.deleteMany({});
  user = await User.create(userData);
  admin = await User.create(adminData);
});

beforeEach(async () => {
  userToken = jwt.sign({ userId: user._id }, config.JWT_SECRET, {
    expiresIn: "1h",
  });
  adminToken = jwt.sign({ userId: admin._id }, config.JWT_SECRET, {
    expiresIn: "1h",
  });
});

describe("Request Controller", () => {
  describe("POST /requests", () => {
    it("should create a new request", async () => {
      const res = await api
        .post("/requests")
        .set("Authorization", userToken)
        .send({
          title: "New Request",
          description: "This is a new request",
          userId: user._id,
        });

      expect(res.statusCode).toBe(201);
      expect(res.body._id).toBeDefined();
      expect(res.body.title).toBe("New Request");
      expect(res.body.description).toBe("This is a new request");
      expect(res.body.userId).toBe(user._id.toString());
    });
  });

  describe("GET /requests", () => {
    it("should return all requests", async () => {
      const res = await api.get("/requests").set("Authorization", adminToken);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe("GET /requests/:id", () => {
    it("should return a request by id", async () => {
      const requestData = {
        title: "Test Request",
        description: "Test Request Description",
        userId: user._id,
      };

      const createdRequest = await Request.create(requestData);

      const res = await api
        .get(`/requests/${createdRequest._id}`)
        .set("Authorization", userToken);

      expect(res.statusCode).toBe(200);
      expect(res.body._id).toBe(createdRequest._id.toString());
      expect(res.body.title).toBe(requestData.title);
      expect(res.body.description).toBe(requestData.description);
      expect(res.body.userId._id.toString()).toBe(user._id.toString());
    });
  });

  describe("PUT /requests/:id", () => {
    it("should update a request by id", async () => {
      const requestData = {
        title: "Test Request",
        description: "Test Request Description",
        userId: user._id,
      };

      const createdRequest = await Request.create(requestData);

      const updatedData = {
        title: "Updated Request",
        description: "Updated Request Description",
      };

      const res = await api
        .put(`/requests/${createdRequest._id}`)
        .set("Authorization", adminToken)
        .send(updatedData);

      expect(res.statusCode).toBe(200);
      expect(res.body._id.toString()).toBe(createdRequest._id.toString());
      expect(res.body.title).toBe(updatedData.title);
      expect(res.body.description).toBe(updatedData.description);
      expect(res.body.userId).toBe(requestData.userId.toString());
    });
  });

  describe("DELETE /requests/:id", () => {
    it("should delete a request by id", async () => {
      const requestData = {
        title: "Test Request",
        description: "Test Request Description",
        userId: user._id,
      };

      const createdRequest = await Request.create(requestData);

      const res = await api
        .delete(`/requests/${createdRequest._id}`)
        .set("Authorization", adminToken);

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe("Request deleted successfully");
    });
  });
});
