const User = require("../models/User");
const generateToken = require("../../utils/generateToken");

// REGISTER
exports.registerUser = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    const cleanEmail = email.toLowerCase().trim();

    const userExists = await User.findOne({ email: cleanEmail });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({
      name,
      email: cleanEmail,
      password: password.trim(),
      role: role.toLowerCase(),
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      classAssigned: user.classAssigned,
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
    console.log("--- LOGIN ATTEMPT ---");
    
    const cleanEmail = email ? email.toLowerCase().trim() : "";
    const cleanPassword = password ? password.trim() : "";

    console.log("Email:", cleanEmail);

    const user = await User.findOne({ email: cleanEmail });

    if (!user) {
      console.log("❌ User not found");
      return res.status(401).json({ message: "Invalid email or password" });
    }

    console.log("✅ User found:", user.email);
    console.log("🔑 Stored Hash ends with:", user.password.slice(-5)); // Log partial hash for safety

    // Match Password
    const isMatch = await user.matchPassword(cleanPassword);
    
    if (isMatch) {
      // Check Role
      if (role && user.role !== role.toLowerCase() && user.role !== role) {
         console.log("❌ Role mismatch");
         return res.status(401).json({ message: "Role mismatch" });
      }

      console.log("✅ Login Successful");
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        classAssigned: user.classAssigned,
        childStudentId: user.childStudentId,
        token: generateToken(user._id),
      });
    } else {
      console.log("❌ Password mismatch");
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (err) {
    next(err);
  }
};

exports.getMe = async (req, res) => {
  res.json(req.user);
};