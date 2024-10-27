import { type Response, type Request, type NextFunction } from "express";

import * as AuthService from "../services/authService";
import { TokenType } from "../models/token";

// middleware for verifying a user is logged in
// tries to verify using access token
// will try to use refresh token as fallback
// to generate new access token
export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const accessToken: string | undefined =
      req.headers.authorization?.split(" ")[1];
    if (!accessToken) {
      res
        .status(403)
        .json({ success: false, error: "Access token not provided." });
      return;
    }

    // try to find matching auth token in our db
    const authResult = await AuthService.tryAuthenticate(
      accessToken,
      TokenType.JwtAccess,
    );

    if (authResult.success && "verifiedToken" in authResult) {
      // set userId in request for controllers to use
      const decodedToken = authResult.verifiedToken;
      if (decodedToken) {
        // if the access token was valid, continue to next
        req.userId = decodedToken.user_id;
        return next();
      } else {
        throw new Error("Decoded token failed");
      }
    }

    // access token did not pass, attempt to find refresh token in httpOnly cookies
    const refreshToken: string | undefined = req.cookies?.refreshToken;
    if (!refreshToken) {
      // no refresh token saved in cookies
      res.status(403).json({
        success: false,
        error: "Invalid access token and no refresh token provided",
      });
      return;
    }

    // if we got here, refresh token was found and we can attempt refresh
    const refreshResult = await AuthService.useRefreshToken(refreshToken);
    if (!refreshResult.success) {
      res.status(403).json({ success: false, error: "Refresh token failed" });
    }

    // after here, refresh token worked and we can set new cookies and refresh tokens
    const { newAccessToken, newRefreshToken } = refreshResult;
    if (!newAccessToken?.value || !newRefreshToken?.value) {
      res
        .status(403)
        .json({ success: false, error: "Failed to generate new tokens" });
      return;
    }

    // set new refresh token in cookie
    res.cookie("refreshToken", newRefreshToken.value, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      expires: newRefreshToken.expires_at || undefined,
    });

    // set new access token in header
    res.setHeader("Authorization", `Bearer ${newAccessToken.value}`);
    req.userId = newAccessToken.user_id;

    return next();
  } catch (err) {
    res.status(500).json({ success: false, error: "Internal Auth Error" });
  }
};
