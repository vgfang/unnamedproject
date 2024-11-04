import jwt, { type JwtPayload } from "jsonwebtoken";

import * as TokenService from "./tokenService";
import { type Token, TokenType } from "../models/token";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

type JWTPayload = {
  userId: number;
  sessionId: string | null;
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
  sessionId: string,
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
    session_id: sessionId,
  };

  const jwtToken = await TokenService.upsertTokenObj(token);
  return jwtToken;
};

export const decodeJWTToken = async (jwtToken: string): Promise<Token> => {
  const decodedToken = jwt.verify(jwtToken, JWT_SECRET) as Token;
  return decodedToken;
};

export const encodeJWTToken = async (
  userId: number,
  sessionId: string | null = null,
): Promise<string> => {
  const jwtPayload: JWTPayload = {
    userId: userId,
    sessionId: sessionId,
  };
  const jwtToken = jwt.sign(jwtPayload, JWT_SECRET);
  return jwtToken;
};

export const tryAuthenticate = async (
  jwtToken: string,
  tokenType: TokenType,
): Promise<AuthResponse> => {
  const decodedToken = jwt.verify(jwtToken, JWT_SECRET) as JWTPayload;
  // verify token exists in db
  const tokenFromDb = await TokenService.getToken(
    decodedToken.userId,
    tokenType,
    decodedToken.sessionId,
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
};

export const createNewAccessAndRefreshTokens = async (
  userId: number,
  sessionId: string,
): Promise<AuthResponse> => {
  // refresh access and refresh token
  const jwtAccess = await storeJWTToken(userId, TokenType.JwtAccess, sessionId);
  const jwtRefresh = await storeJWTToken(
    userId,
    TokenType.JwtRefresh,
    sessionId,
  );

  return {
    success: true,
    newAccessToken: jwtAccess,
    newRefreshToken: jwtRefresh,
  };
};

export const useRefreshToken = async (
  jwtToken: string,
): Promise<AuthResponse> => {
  // need to verify token exists in db
  const authRes = await tryAuthenticate(jwtToken, TokenType.JwtRefresh);
  if (authRes.success) {
    const decodedToken = jwt.verify(jwtToken, JWT_SECRET) as JwtPayload;
    // refresh access and refresh token
    const resWithTokens = await createNewAccessAndRefreshTokens(
      decodedToken.userId,
      decodedToken.sessionId,
    );
    return resWithTokens;
  } else {
    return { success: false, error: "invalid refresh token" };
  }
};
