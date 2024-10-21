import { type Response, type Request, type NextFunction } from "express";

import * as discordAuth from "../services/discordAuth";

export const loginViaDiscord = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { code } = req.body;
    discordAuth.loginDiscord(code);
  } catch (error) {
    res.status(500).json({ error: error });
  }
  return;
};
