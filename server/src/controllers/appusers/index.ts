import { Router } from "express";

import updateAppUserHandler from "./updateAppUserHandler";

const router = Router();

router.post("/", updateAppUserHandler);

export default router;
