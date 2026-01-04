import express from "express";
import { 
  getFeedPosts, 
  getUserPosts, 
  likePost,  
  updatePost, 
  deletePost, 
  addComment, 
  likeComment, 
  deleteComment, 
  replyToComment, 
  getPostById, 
  likeReply, 
  reportPost, 
  resolveReport, 
  reportComment, 
  reportReply 
} from "../controllers/posts.controllers.js";
import { verifyToken, isAdmin } from "../middleware/auth.middleware.js";
import Post from "../models/Post.js";
import { verifyContent } from '../middleware/contentVerification.middleware.js';

const router = express.Router();

/* Get Routes */
router.get("/", verifyToken, getFeedPosts);
router.get("/:userId/posts", verifyToken, getUserPosts);
router.get("/:id", verifyToken, getPostById);

/* Update Routes */
router.patch("/:id/like", verifyToken, likePost);
router.patch("/:id", verifyToken, verifyContent, updatePost);
router.patch("/:postId/comment", verifyToken, verifyContent, addComment);

/* Delete Routes */
router.delete("/:id", verifyToken, deletePost);

/* Comment Routes */
router.patch("/:postId/comments/:commentId/like", verifyToken, likeComment);
router.delete("/:postId/comments/:commentId", verifyToken, deleteComment);
router.patch("/:postId/comments/:commentId/reply", verifyToken, verifyContent, replyToComment);

/* Reply Routes */
router.delete(
  "/:postId/comments/:commentId/replies/:replyId",
  verifyToken,
  async (req, res) => {
    try {
      const { postId, commentId, replyId } = req.params;
      const post = await Post.findById(postId);

      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }

      const comment = post.comments.id(commentId);
      if (!comment) {
        return res.status(404).json({ message: "Comment not found" });
      }

      const reply = comment.replies.id(replyId);
      if (!reply) {
        return res.status(404).json({ message: "Reply not found" });
      }

      comment.replies = comment.replies.filter(
        (r) => r._id.toString() !== replyId.toString()
      );
      await post.save();

      res.status(200).json(post);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

router.patch(
  "/:postId/comments/:commentId/replies/:replyId/like",
  verifyToken,
  async (req, res) => {
    try {
      const { postId, commentId, replyId } = req.params;
      const { userId } = req.body;

      const post = await Post.findById(postId);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }

      const comment = post.comments.id(commentId);
      if (!comment) {
        return res.status(404).json({ message: "Comment not found" });
      }

      const reply = comment.replies.id(replyId);
      if (!reply) {
        return res.status(404).json({ message: "Reply not found" });
      }

      const isLiked = reply.likes.get(userId);
      if (isLiked) {
        reply.likes.delete(userId);
      } else {
        reply.likes.set(userId, true);
      }

      await post.save();
      res.status(200).json({ likes: reply.likes });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  }
);

/* Moderation Routes */
router.post("/:id/report", verifyToken, reportPost);
router.patch("/:id/resolve-report", verifyToken, isAdmin, resolveReport);
router.post("/:postId/comments/:commentId/report", verifyToken, reportComment);
router.post("/:postId/comments/:commentId/replies/:replyId/report", verifyToken, reportReply);

/* Reported Content */
router.get("/reported-content", async (req, res) => {
  try {
    const posts = await Post.find({ "reports.0": { $exists: true } });
    const comments = await Post.aggregate([
      { $unwind: "$comments" },
      { $match: { "comments.reports.0": { $exists: true } } },
      { $project: { 
        _id: "$comments._id",
        content: "$comments.comment",
        postId: "$_id",
        author: "$comments.userName",
        reports: "$comments.reports"
      }}
    ]);
    const replies = await Post.aggregate([
      { $unwind: "$comments" },
      { $unwind: "$comments.replies" },
      { $match: { "comments.replies.reports.0": { $exists: true } } },
      { $project: { 
        _id: "$comments.replies._id",
        content: "$comments.replies.comment",
        postId: "$_id",
        commentId: "$comments._id",
        author: "$comments.replies.userName",
        reports: "$comments.replies.reports"
      }}
    ]);
    
    res.status(200).json({ posts, comments, replies });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;