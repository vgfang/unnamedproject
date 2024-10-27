import jwt from "jsonwebtoken";

import * as TokenService from "./tokenService";
import { type Token, TokenType } from "../models/token";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export type AuthResponse = {
  success: boolean;
  error?: string;
  newAccessToken?: Token;
  newRefreshToken?: Token;
};

const storeJWTToken = async (userId: number, type: TokenType) => {
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

export const tryAuthenticate = async (
  jwtToken: string,
  tokenType: TokenType,
): Promise<AuthResponse> => {
  try {
    const decodedToken = jwt.verify(jwtToken, JWT_SECRET) as Token;
    // verify token exists in db
    const jwtTokenFromDb = await TokenService.getToken(
      decodedToken.user_id,
      tokenType,
    );

    if (
      jwtTokenFromDb &&
      (jwtTokenFromDb.expires_at == null ||
        jwtTokenFromDb.expires_at > new Date())
    ) {
      // valid token
      return { success: true };
    }

    return {
      success: false,
      error: `${tokenType} token for ${decodedToken.user_id} does not exist`,
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
      const decodedToken = jwt.verify(jwtToken, JWT_SECRET) as Token;
      // refresh access and refresh token
      const resWithTokens = await createNewAccessAndRefreshTokens(
        decodedToken.user_id,
      );
      return resWithTokens;
    } else {
      return { success: false, error: "invalid refresh token" };
    }
  } catch (err) {
    throw err;
  }
};
