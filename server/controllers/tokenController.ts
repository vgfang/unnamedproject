import { type Response, type Request } from "express";

import * as tokenService from "../services/tokenService";

export const insertToken = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { user_id, type, value } = req.body;
    const token = await tokenService.upsertToken(user_id, type, value);
    res.status(200).json(token);
    return;
  } catch (error) {
    res.status(500).json({ error: error });
    return;
  }
};

export const getToken = async (req: Request, res: Response): Promise<void> => {
  try {
    const { user_id, type } = req.body;
    const token = await tokenService.getToken(user_id, type);
    res.status(200).json(token);
    return;
  } catch (error) {
    res.status(500).json({ error: error });
    return;
  }
};
