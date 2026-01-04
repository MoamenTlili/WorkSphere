import express from "express";
import { verifyToken } from "../middleware/auth.middleware.js";
import { getNotifications, markAsRead } from "../controllers/notifications.controllers.js";

const router = express.Router();
router.use(verifyToken);

router.get("/", verifyToken, getNotifications);
router.patch("/:id/read", verifyToken, markAsRead); 

export default router;