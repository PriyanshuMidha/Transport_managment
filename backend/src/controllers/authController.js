import bcrypt from "bcryptjs";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { User } from "../models/User.js";
import { createError, sendSuccess } from "../utils/apiResponse.js";
import { signAuthToken } from "../utils/jwt.js";

export const login = asyncHandler(async (req, res) => {
  const username = req.body?.username?.trim();
  const password = req.body?.password;

  if (!username || !password) {
    throw createError("Username and password are required", 400);
  }

  const user = await User.findOne({ normalizedUsername: username.toLowerCase() });

  if (!user) {
    throw createError("Invalid username or password", 401);
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

  if (!isPasswordValid) {
    throw createError("Invalid username or password", 401);
  }

  const token = signAuthToken(user);

  return sendSuccess(
    res,
    {
      token,
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
      },
    },
    "Login successful"
  );
});
