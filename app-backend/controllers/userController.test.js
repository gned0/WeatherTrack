const { server, closeServer } = require("../server");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const config = require("../config");
const request = require("supertest");

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

const newUserData = {
  username: "newtestuser",
  password: "testpassword",
  email: "newtestuser@example.com",
  role: "user",
};

let userToken;
let adminToken;
let user;
let admin;

const api = request(server);

afterAll(async () => {
  await closeServer();
});

beforeAll(async () => {
  user = await User.create(userData);
  admin = await User.create(adminData);

  userToken = jwt.sign({ userId: user._id }, config.JWT_SECRET, {
    expiresIn: "1h",
  });
  adminToken = jwt.sign({ userId: admin._id }, config.JWT_SECRET, {
    expiresIn: "1h",
  });
});

describe("User Controller", () => {
  describe('GET /users', () => {
    it('should return all users', async () => {
      const res = await api
        .get('/users')
        .set('Authorization', adminToken);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThanOrEqual(1);
    });

    it('should not return all users without admin token', async () => {
      const res = await api
        .get('/users')
        .set('Authorization', userToken);

      expect(res.statusCode).toBe(403);
      expect(res.body.message).toBe('Require Admin Role!');
    });
  });

  describe("GET /users/:id", () => {
    it("should return a user by id", async () => {
      const res = await api
        .get(`/users/${user._id}`)
        .set("Authorization", userToken);

      expect(res.statusCode).toBe(200);
      expect(res.body._id).toBe(user._id.toString());
      expect(res.body.username).toBe(user.username);
      expect(res.body.email).toBe(user.email);
      expect(res.body.role).toBe(user.role);
    });

    it("should not return a user by id with invalid id", async () => {
      const res = await api
        .get("/users/invalidid")
        .set("Authorization", userToken);

      expect(res.statusCode).toBe(404);
      expect(res.body.error).toBe("User not found");
    });
  });

  describe("PUT /users/:id", () => {
    it("should update a user by id", async () => {
      const updatedData = {
        username: "updateduser",
        password: "updatedpassword",
        email: "updateduser@example.com",
        role: "user",
      };

      const res = await api
        .put(`/users/${user._id}`)
        .set("Authorization", userToken)
        .send(updatedData);

      expect(res.statusCode).toBe(200);
      expect(res.body._id).toBe(user._id.toString());
      expect(res.body.username).toBe(updatedData.username);
      expect(res.body.email).toBe(updatedData.email);
      expect(res.body.role).toBe(updatedData.role);
    });

    it("should not update a user by id with invalid id", async () => {
      const updatedData = {
        username: "updateduser",
        password: "updatedpassword",
        email: "updateduser@example.com",
        role: "user",
      };

      const res = await api
        .put("/users/invalidid")
        .set("Authorization", userToken)
        .send(updatedData);

      expect(res.statusCode).toBe(404);
      expect(res.body.error).toBe("User not found");
    });
  });

  describe('DELETE /users/:id', () => {
    it('should delete a user by id', async () => {
      const res = await api
        .delete(`/users/${user._id}`)
        .set('Authorization', adminToken);

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe('User deleted successfully');
    });

    it('should not delete a user by id with invalid id', async () => {
      const res = await api
        .delete('/users/invalidid')
        .set('Authorization', adminToken);

      expect(res.statusCode).toBe(404);
      expect(res.body.error).toBe('User not found');
    });
  });
});