import { Router } from "express";
import { type Router as RouterType } from "express";

import * as tokenCtr from "../controllers/tokenController.ts";
import * as ctr from "../controllers/controller.ts";
import * as optCtr from "../controllers/optController.ts";

const router: RouterType = Router();

router.get("/test", ctr.test);

router.post("/request-otp", optCtr.sendOPT);

// tokens
router.post("/insert-token", tokenCtr.insertToken);
router.post("/get-token", tokenCtr.getToken);

export default router;
