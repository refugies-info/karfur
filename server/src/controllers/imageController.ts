import express from "express";
import { set_image } from "./image/lib";

const router = express.Router();

/* TODO: use tsoa */

router.post("/set_image", set_image);

module.exports = router;
