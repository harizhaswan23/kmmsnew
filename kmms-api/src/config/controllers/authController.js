const User = require("../models/User");
const generateToken = require("../../utils/generateToken");

// REGISTER
exports.registerUser = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    
    // Sanitize
    const normalizedEmail = email ? email.trim().toLowerCase() : "";
    const cleanPassword = password ? password.trim() : "";

    const userExists = await User.findOne({ email: normalizedEmail });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({
      name,
      email: normalizedEmail,
      password: cleanPassword,
      role: role.toLowerCase(),
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (err) {
    next(err);
  }
};

// LOGIN
exports.loginUser = async (req, res, next) => {
  try {
    const { email, password, role } = req.body;

    // 1. Sanitize Inputs (Trim spaces & Lowercase email)
    const normalizedEmail = email ? email.trim().toLowerCase() : "";
    const cleanPassword = password ? password.trim() : "";

    console.log(`Login Attempt: ${normalizedEmail}`);

    // 2. Find user
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      console.log("❌ User not found");
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // 3. Check password
    const isMatch = await user.matchPassword(cleanPassword);
    
    if (!isMatch) {
      console.log("❌ Password Mismatch");
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // 4. Role Check (Case insensitive)
    if (role && user.role.toLowerCase() !== role.toLowerCase()) {
      console.log(`❌ Role Mismatch (Exp: ${user.role}, Got: ${role})`);
      return res.status(401).json({ message: "Role mismatch" });
    }

    console.log("✅ Login Successful");

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      childStudentId: user.childStudentId || null,
      token: generateToken(user._id),
    });

  } catch (err) {
    console.error("Login Error:", err);
    next(err);
  }
};

// GET ME
exports.getMe = async (req, res) => {
  res.json(req.user);
};