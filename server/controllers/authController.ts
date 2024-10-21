import { type Response, type Request, type NextFunction } from "express";

import * as discordAuth from "../services/discordAuth";

export const loginViaDiscord = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { code } = req.body;
    res.status(200).json({ code: code });
    return;
    // discordAuth.loginDiscord(code);
  } catch (error) {
    res.status(500).json({ error: error });
    return;
  }
};
