import jwt, { type JwtPayload } from "jsonwebtoken";

import * as TokenService from "./tokenService";
import { type Token, TokenType } from "../models/token";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

type JWTPayload = {
  userId: number;
};

export type AuthResponse = {
  success: boolean;
  error?: string;
  newAccessToken?: Token;
  newRefreshToken?: Token;
  verifiedToken?: Token;
};

const storeJWTToken = async (
  userId: number,
  type: TokenType,
): Promise<Token> => {
  let jwtExpiresIn = 60 * 60; // 1 hour for access

  if (type == TokenType.JwtRefresh) {
    jwtExpiresIn = 60 * 60 * 24 * 30; // 30 days for refresh tokens
  }

  // have the jwt expiry happen
  const expiresAt = new Date();
  expiresAt.setSeconds(expiresAt.getSeconds() + jwtExpiresIn);

  // encode userID to the jwt
  const jwtValue = jwt.sign({ userId }, JWT_SECRET, {
    expiresIn: jwtExpiresIn,
  });

  const token: Token = {
    user_id: userId,
    type: type,
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

export const decodeJWTToken = async (jwtToken: string): Promise<Token> => {
  const decodedToken = jwt.verify(jwtToken, JWT_SECRET) as Token;
  return decodedToken;
};

export const tryAuthenticate = async (
  jwtToken: string,
  tokenType: TokenType,
): Promise<AuthResponse> => {
  try {
    const decodedToken = jwt.verify(jwtToken, JWT_SECRET) as JWTPayload;
    // verify token exists in db
    const tokenFromDb = await TokenService.getToken(
      decodedToken.userId,
      tokenType,
    );

    if (
      tokenFromDb &&
      (tokenFromDb.expires_at == null || tokenFromDb.expires_at > new Date())
    ) {
      // valid token
      return { success: true, verifiedToken: tokenFromDb };
    }

    return {
      success: false,
      error: `${tokenType} token for ${decodedToken.userId} does not exist`,
    };
  } catch (err) {
    throw err;
  }
};

export const createNewAccessAndRefreshTokens = async (
  userId: number,
): Promise<AuthResponse> => {
  try {
    // refresh access and refresh token
    const jwtAccess = await storeJWTToken(userId, TokenType.JwtAccess);
    const jwtRefresh = await storeJWTToken(userId, TokenType.JwtRefresh);

    return {
      success: true,
      newAccessToken: jwtAccess,
      newRefreshToken: jwtRefresh,
    };
  } catch (err) {
    throw err;
  }
};

export const useRefreshToken = async (
  jwtToken: string,
): Promise<AuthResponse> => {
  try {
    // need to verify token exists in db
    const authRes = await tryAuthenticate(jwtToken, TokenType.JwtRefresh);
    if (authRes.success) {
      const decodedToken = jwt.verify(jwtToken, JWT_SECRET) as JwtPayload;
      // refresh access and refresh token
      const resWithTokens = await createNewAccessAndRefreshTokens(
        decodedToken.userId,
      );
      return resWithTokens;
    } else {
      return { success: false, error: "invalid refresh token" };
    }
  } catch (err) {
    throw err;
  }
};
