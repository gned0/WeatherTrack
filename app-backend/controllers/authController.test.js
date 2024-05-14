const { server, closeServer } = require("../server");
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../config");
const request = require("supertest");

const api = request(server);

afterAll(async () => {
  await closeServer();
});

describe("Auth Controller", () => {
  let user;
  let token;

  beforeEach(async () => {
    const password = "password123";
    user = await User.create({
      username: "testuser",
      email: "testuser@example.com",
      password: bcrypt.hashSync(password, 8),
      role: "user",
    });

    token = jwt.sign(
      {
        userId: user._id,
        username: user.username,
        role: user.role,
      },
      config.JWT_SECRET,
      { expiresIn: "1h" }
    );
  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  describe("POST /auth/register", () => {
    it("should register a new user", async () => {
      const res = await api.post("/auth/register").send({
        username: "newuser",
        email: "newuser@example.com",
        password: "password123",
        role: "user",
      });

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe("User was registered successfully!");

      const newUser = await User.findOne({ username: "newuser" });
      expect(newUser).not.toBeNull();
      expect(newUser.password).not.toBe("password123");
    });

    it("should not register a user with missing fields", async () => {
      const res = await api.post("/auth/register").send({
        username: "newuser",
        email: "newuser@example.com",
        password: "",
        role: "user",
      });

      expect(res.statusCode).toBe(500);
      expect(res.body.message).toMatch("All fields are required");
    });

    it("should not register a user with duplicate username or email", async () => {
      const res = await api.post("/auth/register").send({
        username: "testuser",
        email: "testuser@example.com",
        password: "password123",
        role: "user",
      });

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe("Username or email already exists");
    });
  });

  describe("POST /auth/login", () => {
    it("should login a user with valid credentials", async () => {
      const res = await api.post("/auth/login").send({
        username: "testuser",
        password: "password123",
      });

      expect(res.statusCode).toBe(200);
      expect(res.body.auth).toBeTruthy();
      expect(res.body.token).toBeDefined();
    });

    it("should not login a user with invalid credentials", async () => {
      const res = await api.post("/auth/login").send({
        username: "testuser",
        password: "wrongpassword",
      });

      expect(res.statusCode).toBe(401);
      expect(res.body.message).toBe("Invalid username or password");
    });
  });
});
