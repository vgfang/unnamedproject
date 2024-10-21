import { type Response, type Request, type NextFunction } from "express";

import * as discordAuthService from "../services/discordAuthService";

export const loginViaDiscord = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { code, redirectURI } = req.body;
    const discordAuthResponse = await discordAuthService.loginDiscord(
      code,
      redirectURI,
    );
    res.status(200).json(discordAuthResponse);
    return;
  } catch (error) {
    res.status(500).json({ error: error });
    return;
  }
};
