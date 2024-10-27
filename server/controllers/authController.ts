import { type Response, type Request, type NextFunction } from "express";
import { v4 } from "uuid";

import * as discordAuthService from "../services/discordAuthService";
import * as authService from "../services/authService";

import { type User } from "../models/user";

export const loginViaDiscord = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { code, redirectURI } = req.body;
    // get jwt access token using code
    const jwtAccessToken: string = await discordAuthService.loginDiscord(
      code,
      redirectURI,
    );

    console.log(jwtAccessToken);
    res.status(200).json({ message: "successfully logged in via discord" });
    return;
  } catch (error) {
    res.status(500).json({ error: error });
    return;
  }
};

export const logout = async (req: Request, res: Response) => {};

export const logoutAll = async (req: Request, res: Response) => {};
