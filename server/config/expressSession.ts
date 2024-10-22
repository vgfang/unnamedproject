import "express-session";
import { type User } from "../models/user";

declare module "express-session" {
  interface SessionData {
    user: User;
  }
}
