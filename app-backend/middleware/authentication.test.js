const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const config = require("../config");
const authentication = require("../middleware/authentication");

jest.mock("jsonwebtoken");
jest.mock("../models/userModel");

describe("Authentication Middleware", () => {
  let mockRequest, mockResponse, nextSpy;

  const setupMockData = () => {
    mockRequest = {
      headers: {},
      user: null,
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
    nextSpy = jest.fn();
  };

  beforeEach(setupMockData);

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("verifyToken", () => {
    test("should return 403 if no token is provided", async () => {
      await authentication.verifyToken(mockRequest, mockResponse, nextSpy);
      expect(mockResponse.status).toHaveBeenCalledWith(403);
      expect(mockResponse.send).toHaveBeenCalledWith({
        message: "No token provided",
      });
      expect(nextSpy).not.toHaveBeenCalled();
    });

    test("should return 404 if no user is found", async () => {
      mockRequest.headers.authorization = "Bearer validToken";
      jwt.verify.mockReturnValueOnce({ userId: "validUserId" });
      User.findById.mockResolvedValueOnce(null);

      await authentication.verifyToken(mockRequest, mockResponse, nextSpy);
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.send).toHaveBeenCalledWith({
        message: "No user found",
      });
      expect(nextSpy).not.toHaveBeenCalled();
    });
  });

  describe("isAdmin", () => {
    test("should return 403 if the user is not an admin", () => {
      mockRequest.user = { _id: "validUserId", role: "user" };
      authentication.isAdmin(mockRequest, mockResponse, nextSpy);
      expect(mockResponse.status).toHaveBeenCalledWith(403);
      expect(mockResponse.send).toHaveBeenCalledWith({
        message: "Require Admin Role!",
      });
      expect(nextSpy).not.toHaveBeenCalled();
    });
  });
});
