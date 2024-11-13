import { type Response, type Request, type NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";

import * as DiscordAuthService from "../services/discordAuthService";
import * as AuthService from "../services/authService";

import { type User } from "../models/user";

// this covers register as well as login
export const loginViaDiscord = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { code, redirectURI } = req.body;
    // get jwt access token using code
    const discordLoginResp: DiscordAuthService.loginDiscordResponse =
      await DiscordAuthService.loginDiscord(code, redirectURI);

    // set the refresh token in an http only cookie
    res.cookie("refreshToken", discordLoginResp.jwtRefresh, {
      httpOnly: true, // prevents JavaScript access
      secure: process.env.NODE_ENV === "production", // use secure cookies in production
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days in milliseconds
    });

    res.status(200).json({
      success: true,
      message: "successfully logged in via discord",
      jwtAccess: discordLoginResp.jwtAccess,
    });
    return;
  } catch (error) {
    res.status(500).json({ error: error });
    return;
  }
};

export const registerViaEmail = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { email, password } = req.body;
    // server side validation
    if (!email) {
      res
        .status(400)
        .json({ successs: false, message: "email cannot be empty" });
    } else if (!password || password.length <= 6) {
      res.status(400).json({
        success: false,
        message: "password must be at least 7 chars long",
      });
    }

    const registerRes = await AuthService.registerUserViaEmail(email, password);
    if (registerRes.success) {
      res.status(200).json({
        success: true,
        message: "successfully registered using email",
      });
    } else if (registerRes.hasOwnProperty("error")) {
      res.status(400).json({ success: false, message: registerRes.error });
    } else {
      res.status(500).json({ success: false, message: "unspecified" });
    }
    return;
  } catch (error) {
    res.status(500).json({ success: false, error: error });
    return;
  }
};

export const loginViaEmail = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { email, password } = req.body;
    AuthService.loginUserViaEmail(email, password);
    res
      .status(200)
      .json({ success: true, message: "successfully registered using email" });
  } catch (error) {
    res.status(500).json({ success: false, error: error });
    return;
  }
};

export const logout = async (req: Request, res: Response) => {};

export const logoutAll = async (req: Request, res: Response) => {};
