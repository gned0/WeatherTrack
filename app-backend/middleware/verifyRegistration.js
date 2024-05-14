const User = require("../models/userModel");

const checkDuplicateUsernameOrEmail = async (req, res, next) => {
    try {
        const { username, email } = req.body;

        const usernameExists = await User.findOne({ username });
        if (usernameExists) {
            return res.status(400).json({ message: "Username already exists" });
        }

        const emailExists = await User.findOne({ email });
        if (emailExists) {
            return res.status(400).json({ message: "Email already exists" });
        }

        next();
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
};

// In case more registration checks are needed later
const verifySignUp = {
  checkDuplicateUsernameOrEmail
};

module.exports = verifySignUp;