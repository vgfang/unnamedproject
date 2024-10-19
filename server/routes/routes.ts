import { Router } from "express";
import { type Router as RouterType } from "express";

import * as ctr from "../controllers/controller.ts";
import * as optCtr from "../controllers/optController.ts";

const router: RouterType = Router();

router.get("/", ctr.test);

router.post("/request-otp", optCtr.sendOPT);

export default router;
