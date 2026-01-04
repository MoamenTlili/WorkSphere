import express from "express";
import { verifyToken, isAdmin } from "../middleware/auth.middleware.js";
import {
  getAllUsers,
  deleteUser,
  updateUserRole,
  getReportedPosts,
  deletePost,
  getReportedContent,
  deleteComment,
  deleteReply,
  getAiDetectionLogs
} from "../controllers/admin.controllers.js";

const router = express.Router();


router.use(verifyToken, isAdmin);


router.get("/users", getAllUsers);
router.delete("/users/:id", deleteUser);
router.patch("/users/:id/role", updateUserRole);


router.get("/posts/reported", getReportedPosts);
router.delete("/posts/:id", deletePost);
router.get("/reported-content", getReportedContent);
router.delete("/posts/:postId/comments/:commentId", deleteComment);
router.delete("/posts/:postId/comments/:commentId/replies/:replyId", deleteReply);


router.get("/ai-detections", getAiDetectionLogs);

export default router;