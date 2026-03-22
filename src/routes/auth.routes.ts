import express from "express";
import * as AuthController from "../controllers/auth.controller";
import validateAuth from "../middleware/validateAuth";

const router = express.Router();

router.post("/register", validateAuth, AuthController.register);
router.post("/login", validateAuth, AuthController.login);
router.post("/refresh", AuthController.refresh);

export default router;
