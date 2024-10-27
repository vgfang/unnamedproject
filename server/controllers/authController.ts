import { type Response, type Request, type NextFunction } from "express";
import { v4 } from "uuid";

import * as DiscordAuthService from "../services/discordAuthService";
import * as authService from "../services/authService";

import { type User } from "../models/user";

export const loginViaDiscord = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { code, redirectURI } = req.body;
    // get jwt access token using code
    const discordLoginResp: DiscordAuthService.loginDiscordResponse =
      await DiscordAuthService.loginDiscord(code, redirectURI);

    console.log(discordLoginResp.jwtRefresh);

    // set the refresh token in an http only cookie
    res.cookie("refreshToken", discordLoginResp.jwtRefresh, {
      httpOnly: true, // prevents JavaScript access
      secure: process.env.NODE_ENV === "production", // use secure cookies in production
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days in milliseconds
    });

    res.status(200).json({
      message: "successfully logged in via discord",
      data: { jwtAccess: discordLoginResp.jwtAccess },
    });
    return;
  } catch (error) {
    res.status(500).json({ error: error });
    return;
  }
};

export const logout = async (req: Request, res: Response) => {};

export const logoutAll = async (req: Request, res: Response) => {};
