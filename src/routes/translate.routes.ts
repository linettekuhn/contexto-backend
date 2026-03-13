import express from "express";
import validateTranslation from "../middleware/validateTranslation";
import { translateController } from "../controllers/translation.controller";

const router = express.Router();

router.post("/", validateTranslation, translateController);

export default router;
