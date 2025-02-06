import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: [6, "Password must be at least 6 characters long"],
    },
    rollNo: {
      type: Number,
      required: true,
      unique: true,
    },
    phoneNo: {
      type: Number,
      required: true,
      unique: true,
    },
    role: {
      type: String,
      enum: ["player", "admin"],
      default: "player",
    },
    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
    },
    refreshToken: String,
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    otpForPasswordReset: String,
    otpExpiry: Date,
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);
export default User;
