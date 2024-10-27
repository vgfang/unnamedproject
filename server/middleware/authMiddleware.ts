import { type Response, type Request, type NextFunction } from "express";

// middleware for verifying a user is logged in
// tries to verify using access token
// will try to use refresh token as fallback
// to generate new access token
export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {};
