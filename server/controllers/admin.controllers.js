import User from "../models/Users.js";
import Post from "../models/Post.js";
import AiDetectionLog from "../models/AiDetectionLog.js";

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

export const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    const isAdmin = role === 'admin';

    const user = await User.findByIdAndUpdate(
      id,
      { role, isAdmin },
      { new: true }
    ).select("-password");
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    res.status(200).json(user);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

export const getReportedPosts = async (req, res) => {
  try {
    const posts = await Post.find({ "reports.0": { $exists: true } })
      .sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

export const deletePost = async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

export const getReportedContent = async (req, res) => {
  try {
    const posts = await Post.find({ "reports.0": { $exists: true } });
    
    const comments = await Post.aggregate([
      { $unwind: "$comments" },
      { $match: { "comments.reports.0": { $exists: true } } },
      { $project: { 
        _id: "$comments._id",
        text: "$comments.comment",
        postId: "$_id",
        postDescription: "$description",
        firstName: "$comments.firstName",
        lastName: "$comments.lastName",
        userName: "$comments.userName",
        userPicturePath: "$comments.userPicturePath",
        userId: "$comments.userId",
        reports: "$comments.reports",
        createdAt: "$comments.createdAt"
      }}
    ]);
    
    const replies = await Post.aggregate([
      { $unwind: "$comments" },
      { $unwind: "$comments.replies" },
      { $match: { "comments.replies.reports.0": { $exists: true } } },
      { $project: { 
        _id: "$comments.replies._id",
        text: "$comments.replies.comment",
        postId: "$_id",
        commentId: "$comments._id",
        commentText: "$comments.comment",
        firstName: "$comments.replies.firstName",
        lastName: "$comments.replies.lastName",
        userName: "$comments.replies.userName",
        userPicturePath: "$comments.replies.userPicturePath",
        userId: "$comments.replies.userId",
        reports: "$comments.replies.reports",
        createdAt: "$comments.replies.createdAt"
      }}
    ]);
    
    res.status(200).json({ posts, comments, replies });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    
    // Remove the comment
    post.comments = post.comments.filter(
      comment => comment._id.toString() !== commentId
    );
    
    await post.save();
    
    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteReply = async (req, res) => {
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
    
    comment.replies = comment.replies.filter(
      reply => reply._id.toString() !== replyId
    );
    
    await post.save();
    res.status(200).json({ message: "Reply deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAiDetectionLogs = async (req, res) => {
  try {
    const logs = await AiDetectionLog.find()
      .populate('user')  
      .sort({ createdAt: -1 })
      .exec();  
    
    console.log('First log with user:', logs[0]?.user);
    
    res.status(200).json(logs);
  } catch (e) {
    console.error('Population error:', e);
    res.status(500).json({ error: e.message });
  }
};