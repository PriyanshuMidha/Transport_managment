import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    normalizedUsername: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      default: "ADMIN",
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("validate", function normalizeUsername(next) {
  if (this.username) {
    this.username = this.username.trim();
    this.normalizedUsername = this.username.toLowerCase();
  }
  next();
});

export const User = mongoose.model("User", userSchema);
