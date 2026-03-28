import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import * as historyController from "../controllers/history.controller";

const router = Router();

// only allow authenticated users to use history routes
router.use(authMiddleware);

router.get("/", historyController.getHistory);
router.delete("/:id", historyController.deleteEntry);

export default router;
