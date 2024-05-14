const User = require("../models/userModel.js");
const config = require('../config');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.register = (req, res) => {
  if (!req.body.username || !req.body.email || !req.body.password) {
    return res.status(500).send({ message: "All fields are required" });
  }

  User.findOne({ $or: [{ username: req.body.username }, { email: req.body.email }] })
    .then((existingUser) => {
      if (existingUser) {
        return res.status(400).send({ message: "Username or email already exists" });
      }

      const user = new User({
        username: req.body.username,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8),
        role: req.body.role ? req.body.role : "user",
      });

      user
        .save()
        .then(() => {
          res.send({ message: "User was registered successfully!" });
        })
        .catch((err) => {
          res.status(500).send({ message: err });
        });
    })
    .catch((err) => {
      res.status(500).send({ message: err });
    });
};

exports.login = (req, res) => {
  User.findOne({ username: req.body.username })
    .then((user) => {
      if (!user) {
        return res.status(401).send({ message: "Invalid username or password" });
      }

      const passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({ message: "Invalid username or password" });
      }

      const payload = {
        userId: user._id,
        username: user.username,
        role: user.role
      }

      const token = jwt.sign(payload, config.JWT_SECRET, { expiresIn: '1h' })

      res.status(200).send({ auth: true, token: token });
      console.log("Succesfully logged in");
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send({ message: err });
    });
};
