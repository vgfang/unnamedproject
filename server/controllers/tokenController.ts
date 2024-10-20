import { type Response, type Request } from "express";

import * as tokenService from "../services/tokenService";

export const insertToken = async (
  req: Request,
  res: Response,
): Promise<void> => {
  res.status(200).json({
    message: "hey",
    success: true,
  });
  return;
};
