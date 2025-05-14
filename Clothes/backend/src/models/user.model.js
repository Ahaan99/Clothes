import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const SALT_ROUNDS = 10;

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    this.password = await bcrypt.hash(this.password, salt);
    console.log(
      "Password hashed in pre-save:",
      this.password.substring(0, 10) + "..."
    );
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  try {
    console.log("Attempting password verification");
    // Use hash sync for consistency
    const isMatch = bcrypt.compareSync(enteredPassword, this.password);
    console.log("Password verification result:", isMatch);
    return isMatch;
  } catch (error) {
    console.error("Password verification error:", error);
    return false;
  }
};

userSchema.methods.generateToken = function () {
  return jwt.sign(
    {
      id: this._id.toString(), // Convert ObjectId to string
      isAdmin: this.isAdmin,
      email: this.email,
    },
    process.env.JWT_SECRET,
    { expiresIn: "24h" }
  );
};

userSchema.methods.toAuthJSON = function () {
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    isAdmin: this.isAdmin,
  };
};

export default mongoose.model("User", userSchema);
