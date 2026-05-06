import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export const signAuthToken = (user) =>
  jwt.sign(
    {
      sub: user._id.toString(),
      username: user.username,
      role: user.role,
    },
    env.jwtSecret,
    {
      expiresIn: env.jwtExpiresIn,
    }
  );

export const verifyAuthToken = (token) => jwt.verify(token, env.jwtSecret);
