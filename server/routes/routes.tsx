import { Router } from "express";
import * as ctr from "../controllers/controller.tsx";
import * as optCtr from "../controllers/optController.tsx";

const router = Router();

router.get("/", ctr.test);

router.post("/request-otp", optCtr.sendOPT);

export default router;
