import { type Response, type Request, type NextFunction } from "express";

import * as discordAuthService from "../services/discordAuthService";

export const loginViaDiscord = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { code, redirectURI } = req.body;
    // get user info
    const discordAuthResponse = await discordAuthService.loginDiscord(
      code,
      redirectURI,
    );
    // set session
    req.session.user = discordAuthResponse;
    res.status(200).json({ message: "successfully logged in via discord" });
    return;
  } catch (error) {
    res.status(500).json({ error: error });
    return;
  }
};

export const logout = async (req: Request, res: Response) => {};
