import { Router } from "express";

import getNotificationsHandler from "./getNotificationsHandler";
import markAsSeenHandler from "./markAsSeenHandler";

const router = Router();

router.get("/", getNotificationsHandler);
router.post("/seen", markAsSeenHandler);

export default router;
