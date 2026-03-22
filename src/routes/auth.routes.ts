import express from "express";
import * as AuthController from "../controllers/auth.controller";
import validateAuth from "../middleware/validateAuth";

const router = express.Router();

router.post("/register", validateAuth, AuthController.register);
router.post("/login", validateAuth, AuthController.login);
router.post("/refresh", AuthController.refresh);
router.post("/logout", AuthController.logout);

export default router;
