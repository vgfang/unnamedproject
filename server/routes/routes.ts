import { Router } from "express";
import { type Router as RouterType } from "express";

import * as tokenCtr from "../controllers/tokenController.ts";
import * as ctr from "../controllers/controller.ts";
import * as optCtr from "../controllers/optController.ts";
import * as authCtr from "../controllers/authController.ts";
import { authMiddleware } from "../middleware/authMiddleware.ts";

const router: RouterType = Router();

router.get("/test", ctr.test);

router.post("/request-otp", optCtr.sendOPT);

// tokens
router.post("/insert-token", tokenCtr.insertToken);
router.post("/get-token", tokenCtr.getToken);

// auth
router.post("/auth/login-discord", authCtr.loginViaDiscord);
router.post("/auth/login-email", authCtr.loginViaEmail);
router.post("/auth/register-email", authCtr.registerViaEmail);

// protected routes
router.get("/protected", authMiddleware, (req, res) => {
  res.status(200).json({ message: "Access granted" });
});

export default router;
