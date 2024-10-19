import { type Response, type Request, type NextFunction } from "express";

export const test = async (req: Request, res: Response): Promise<void> => {
  res.status(200).json({
    message: "hey",
    success: true,
  });
  return;
};
