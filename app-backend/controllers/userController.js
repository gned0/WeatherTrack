const userModel = require("../models/userModel.js");
var jwt = require("jsonwebtoken");

exports.createUser = async (req, res) => {
  try {
    const user = new userModel(req.body);
    await user.save();
    res.status(201).json(user);
  } catch (e) {
    console.error('Error creating user:', e);
    res.status(500).json({ e: 'Internal Server Error' });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await userModel.find({});
    res.json(users);
  } catch (e) {
    console.error("Error retrieving users:", e);
    res.status(500).json({ e: "Internal Server Error" });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await userModel.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (e) {
    if (e.name === 'CastError') {
      return res.status(404).json({ error: "User not found" });
    }
    console.error("Error retrieving user by ID:", e);
    res.status(500).json({ e: "Internal Server Error" });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const user = await userModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (e) {
    if (e.name === 'CastError') {
      return res.status(404).json({ error: "User not found" });
    } else if (e.code === 11000) {
      return res.status(409).json({ error: "Username or email already exists in the system" });
    }
    console.error("Error updating user:", e);
    res.status(500).json({ e: "Internal Server Error" });
  }
};


exports.deleteUser = async (req, res) => {
  try {
    const user = await userModel.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ message: "User deleted successfully" });
  } catch (e) {
    if (e.name === 'CastError') {
      return res.status(404).json({ error: "User not found" });
    }
    console.error("Error deleting user:", e);
    res.status(500).json({ e: "Internal Server Error" });
  }
};
