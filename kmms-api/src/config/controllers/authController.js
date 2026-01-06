const User = require("../models/User");
const generateToken = require("../utils/generateToken"); // Ensure you have this utility

// REGISTER (Admin/Teacher mostly, but logic is here)
exports.registerUser = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({
      name,
      email,
      password,
      role,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (err) {
    next(err);
  }
};

// LOGIN USER (Fixed for Parents)
exports.loginUser = async (req, res, next) => {
  try {
    const { email, password, role } = req.body;

    // 1. Find user by email
    const user = await User.findOne({ email });

    // 2. Check password
    if (user && (await user.matchPassword(password))) {
      
      // 3. (Optional) Security Check: Ensure role matches if provided
      // If the frontend sends 'role', make sure the user actually HAS that role.
      if (role && user.role !== role) {
        return res.status(401).json({ 
          message: `Access denied. You are registered as a ${user.role}, not a ${role}.` 
        });
      }

      // 4. Send Response (INCLUDE childStudentId for Parents)
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        // vital for fetching parent-specific data (timetables/grades)
        childStudentId: user.childStudentId || null, 
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (err) {
    next(err);
  }
};