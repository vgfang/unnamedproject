import jwt from "jsonwebtoken";

import * as TokenService from "./tokenService";
import { type Token, TokenType } from "../models/token";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export const storeJWTAuthToken = async (userId: number) => {
  const jwtExpiresIn = 60 * 60; // 1 hour

  // have the jwt expiry happen
  const expiresAt = new Date();
  expiresAt.setSeconds(expiresAt.getSeconds() + jwtExpiresIn);

  // encode userID to the jwt
  const jwtValue = jwt.sign({ userId }, JWT_SECRET, {
    expiresIn: jwtExpiresIn,
  });

  const token: Token = {
    user_id: userId,
    type: TokenType.JwtAuth,
    value: jwtValue,
    expires_at: expiresAt,
  };

  try {
    const jwtToken = await TokenService.upsertTokenObj(token);
    return jwtToken;
  } catch (err) {
    throw err;
  }
};
