const { server, closeServer } = require("../server");
const Notification = require("../models/notificationModel");
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

let user;
let userToken;

const api = request(server);

afterAll(async () => {
  await User.deleteMany({});
  await Notification.deleteMany({});
  await closeServer();
});

beforeAll(async () => {
  await User.deleteMany({});
  user = await User.create(userData);
});

beforeEach(async () => {
  userToken = jwt.sign({ userId: user._id }, config.JWT_SECRET, {
    expiresIn: "1h",
  });
});

describe("Notification Controller", () => {
  describe("POST /notifications", () => {
    it("should create a new notification", async () => {
      const notificationData = {
        userid: user._id,
        location: "New York",
        attribute: "temperature",
        operand: "gt",
        threshold: 30,
      };

      const res = await api
        .post("/notifications")
        .set("Authorization", userToken)
        .send(notificationData);

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe("Notification was created successfully!");
    });
  });

  describe("GET /notifications", () => {
    it("should return all notifications for the user", async () => {
      // Create two notifications, one for the user and one for a different user
      const userNotificationData = {
        userid: user._id,
        location: "New York",
        attribute: "temperature",
        operand: "gt",
        threshold: 30,
      };

      const otherUserNotificationData = {
        userid: new mongoose.Types.ObjectId(), // Use a different user ID
        location: "Los Angeles",
        attribute: "humidity",
        operand: "lt",
        threshold: 50,
      };

      await Notification.create(userNotificationData);
      await Notification.create(otherUserNotificationData);

      // Make a GET request to /notifications with the user's ID as a query parameter
      const res = await api
        .get("/notifications?userid=" + user._id)
        .set("Authorization", userToken);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);

      // Check that the response only includes the user's notification
      expect(res.body.length).toBe(1);
      expect(res.body[0]._id).toBe(userNotificationData._id.toString());
      expect(res.body[0].location).toBe(userNotificationData.location);
      expect(res.body[0].attribute).toBe(userNotificationData.attribute);
      expect(res.body[0].operand).toBe(userNotificationData.operand);
      expect(res.body[0].threshold).toBe(userNotificationData.threshold);
    });
  });

  describe("GET /notifications/:id", () => {
    it("should return a notification by id", async () => {
      const notificationData = {
        userid: user._id,
        location: "New York",
        attribute: "temperature",
        operand: "gt",
        threshold: 30,
      };

      const createdNotification = await Notification.create(notificationData);

      const res = await api
        .get(`/notifications/${createdNotification._id}`)
        .set("Authorization", userToken);

      expect(res.statusCode).toBe(200);
      expect(res.body._id).toBe(createdNotification._id.toString());
      expect(res.body.location).toBe(notificationData.location);
      expect(res.body.attribute).toBe(notificationData.attribute);
      expect(res.body.operand).toBe(notificationData.operand);
      expect(res.body.threshold).toBe(notificationData.threshold);
    });
  });

  describe("PUT /notifications/:id", () => {
    it("should update a notification by id", async () => {
      const notificationData = {
        userid: user._id,
        location: "New York",
        attribute: "temperature",
        operand: "gt",
        threshold: 30,
      };

      const createdNotification = await Notification.create(notificationData);

      const updatedData = {
        location: "Los Angeles",
        attribute: "humidity",
        operand: "lt",
        threshold: 50,
      };

      const res = await api
        .put(`/notifications/${createdNotification._id}`)
        .set("Authorization", userToken)
        .send(updatedData);

      expect(res.statusCode).toBe(200);
      expect(res.body._id.toString()).toBe(createdNotification._id.toString());
      expect(res.body.location).toBe(updatedData.location);
      expect(res.body.attribute).toBe(updatedData.attribute);
      expect(res.body.operand).toBe(updatedData.operand);
      expect(res.body.threshold).toBe(updatedData.threshold);
    });
  });

  describe("DELETE /notifications/:id", () => {
    it("should delete a notification by id", async () => {
      const notificationData = {
        userid: user._id,
        location: "New York",
        attribute: "temperature",
        operand: "gt",
        threshold: 30,
      };

      const createdNotification = await Notification.create(notificationData);

      const res = await api
        .delete(`/notifications/${createdNotification._id}`)
        .set("Authorization", userToken);

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe("Notification was deleted successfully!");
    });
  });
});
