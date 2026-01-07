const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    password: { type: String, required: true },

    role: {
      type: String,
      enum: ["admin", "teacher", "parent"],
      required: true,
    },

    // Parent Link
    childStudentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
    },

    profileImage: { type: String, default: "" },

    // Teacher Fields
    phone: String,
    qualification: { type: String, enum: ["Diploma", "Degree"] },
    hireDate: Date,
    epfNo: String,
    taxNo: String,
    classAssigned: String,
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
  },
  { timestamps: true }
);

// Hash password (FIXED: Prevents Double Hashing)
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  // Safety: If password looks like it's already hashed, skip
  if (this.password && this.password.startsWith("$2")) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);