import bcrypt from "bcryptjs";
import { User } from "../models/User.js";
import { DEFAULT_ADMIN } from "../utils/constants.js";

export const ensureDefaultAdminUser = async () => {
  const normalizedUsername = DEFAULT_ADMIN.username.toLowerCase();
  const existingUser = await User.findOne({ normalizedUsername });

  if (existingUser) {
    return;
  }

  const passwordHash = await bcrypt.hash(DEFAULT_ADMIN.password, 10);

  await User.create({
    username: DEFAULT_ADMIN.username,
    normalizedUsername,
    passwordHash,
    role: DEFAULT_ADMIN.role,
  });
};
