import Post from "../models/Post.js";
import User from "../models/Users.js";
import Notification from "../models/Notification.js";
import mongoose from "mongoose";
console.log("Post model imported:", Post ? "Success" : "Failed");

/* Create */
export const createPost = async (req, res) => {
    try {
        const { description, picturePath } = req.body;
        const userId = req.user.id; 

        if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "Invalid userId" });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const newPost = new Post({
            userId, 
            firstName: user.firstName, 
            lastName: user.lastName,   
            location: user.location,
            description,
            userPicturePath: user.picturePath,
            picturePath: req.file ? `/uploads/${req.file.filename}` : "",
            likes: {},
            comments: [],
          });

        console.log("New post to be saved:", newPost);

        await newPost.save();

        console.log("Post saved successfully:", newPost);

        res.status(201).json(newPost);

    } catch (e) {
        console.error("Error in createPost function:", e);
        res.status(500).json({ message: e.message });
    }
};

/* Read */
export const getFeedPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate({
      path: "comments",
      populate: {
        path: "replies",
      },
    });
    res.status(200).json(posts);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export const getUserPosts = async (req, res) => {
    try{
        const { userId } = req.params;
        const post = await Post.find({ userId });
        res.status(200).json(post);
    } catch (e) {
        res.status(404).json({ message: e.message })
    }
}

export const getPostById = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id).populate({
      path: "comments",
      populate: {
        path: "replies",
      },
    });
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(200).json(post);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

/* Update */
export const likePost = async (req, res) => {
    try {
      const { id } = req.params;
      const { userId } = req.body;
      const post = await Post.findById(id);
  
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
  
      const isLiked = post.likes.get(userId);
      if (isLiked) {
        post.likes.delete(userId);
      } else {
        post.likes.set(userId, true);
  
        if (userId.toString() !== post.userId.toString()) {
          const sender = await User.findById(userId);
          await Notification.create({
            userId: post.userId.toString(),
            senderId: userId.toString(),
            senderName: `${sender.firstName} ${sender.lastName}`,
            senderPicture: sender.picturePath,
            postId: id,
            type: "like",
            message: `${sender.firstName} liked your post.`,
          });
        }
      }
  
      await post.save();
      res.status(200).json(post);
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
};

export const updatePost = async (req, res) => {
    try {
        const { id } = req.params;
        const { description } = req.body;

        const updatedPost = await Post.findByIdAndUpdate(
            id,
            { description },
            { new: true } 
        );

        if (!updatedPost) {
            return res.status(404).json({ message: "Post not found" });
        }

        res.status(200).json(updatedPost);
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
}

export const deletePost = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedPost = await Post.findByIdAndDelete(id);

        if (!deletedPost) {
            return res.status(404).json({ message: "Post not found" });
        }

        res.status(200).json({ message: "Post deleted successfully" });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
}

export const addComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId, comment } = req.body;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const newComment = {
      userId: userId.toString(),
      userName: `${user.firstName} ${user.lastName}`,
      userPicturePath: user.picturePath,
      comment,
      likes: new Map(),
      replies: []
    };

    post.comments.push(newComment);
    await post.save();

    // Send notification to post owner if the commenter is not the owner
    if (userId.toString() !== post.userId.toString()) {
      await Notification.create({
        userId: post.userId.toString(),
        senderId: userId.toString(),
        senderName: `${user.firstName} ${user.lastName}`,
        senderPicture: user.picturePath,
        postId: postId,
        type: "comment",
        message: `${user.firstName} commented on your post.`,
      });
    }

    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Like a Comment
export const likeComment = async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    const { userId } = req.body;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const comment = post.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    const isLiked = comment.likes.get(userId);
    if (isLiked) {
      comment.likes.delete(userId);
    } else {
      comment.likes.set(userId, true);

      if (userId.toString() !== comment.userId.toString()) {
        const sender = await User.findById(userId);
        await Notification.create({
          userId: comment.userId.toString(),
          senderId: userId.toString(),
          senderName: `${sender.firstName} ${sender.lastName}`,
          senderPicture: sender.picturePath,
          postId: postId,
          commentId: commentId,
          type: "like",
          message: `${sender.firstName} liked your comment.`,
        });
      }
    }

    await post.save();
    res.status(200).json(post);
  } catch (error) {
    console.error("Error in likeComment:", error);
    res.status(500).json({ message: error.message });
  }
};

export const likeReply = async (req, res) => {
  try {
    const { postId, commentId, replyId } = req.params;
    const { userId } = req.body;

    const PostModel = mongoose.models.Post || Post;
    if (!PostModel) {
      throw new Error("Post model not available in mongoose");
    }

    const post = await PostModel.findById(postId);
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

    if (!reply.likes || !(reply.likes instanceof Map)) {
      reply.likes = new Map();
    }

    const isLiked = reply.likes.get(userId);
    if (isLiked) {
      reply.likes.delete(userId);
    } else {
      reply.likes.set(userId, true);

      if (userId.toString() !== reply.userId.toString()) {
        const sender = await User.findById(userId);
        await Notification.create({
          userId: reply.userId.toString(),
          senderId: userId.toString(),
          senderName: `${sender.firstName} ${sender.lastName}`,
          senderPicture: sender.picturePath,
          postId: postId,
          commentId: commentId,
          replyId: replyId,
          type: "like",
          message: `${sender.firstName} liked your reply.`,
        });
      }
    }

    post.markModified('comments');
    const savedPost = await post.save();
    res.status(200).json(savedPost);
  } catch (error) {
    console.error("Error in likeReply:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete a Comment
export const deleteComment = async (req, res) => {
  try {
    const { postId, commentId } = req.params;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    post.comments = post.comments.filter(
      (comment) => comment._id.toString() !== commentId
    );

    await post.save();
    res.status(200).json(post);
  } catch (error) {
    console.error("Error in deleteComment:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// Reply to a Comment
export const replyToComment = async (req, res) => {
  try {
    const { postId, commentId, parentReplyId } = req.params;
    const { userId, comment } = req.body;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const parentComment = post.comments.id(commentId);
    if (!parentComment) {
      return res.status(404).json({ message: "Parent comment not found" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const reply = {
      userId: userId.toString(),
      userName: `${user.firstName} ${user.lastName}`,
      userPicturePath: user.picturePath,
      comment,
      likes: new Map(),
      replies: [],
    };

    if (parentReplyId) {
      const parentReply = findReply(parentComment.replies, parentReplyId);
      if (!parentReply) {
        return res.status(404).json({ message: "Parent reply not found" });
      }
      parentReply.replies.push(reply);
    } else {
      parentComment.replies.push(reply);
    }

    await post.save();

    if (userId.toString() !== parentComment.userId.toString()) {
      await Notification.create({
        userId: parentComment.userId.toString(),
        senderId: userId.toString(),
        senderName: `${user.firstName} ${user.lastName}`,
        senderPicture: user.picturePath,
        postId: postId,
        commentId: commentId,
        type: "reply",
        message: `${user.firstName} replied to your comment.`,
      });
    }

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// A helper function to find a reply by ID recursively
const findReply = (replies, replyId) => {
  for (const reply of replies) {
    if (reply._id.toString() === replyId) {
      return reply;
    }
    if (reply.replies.length > 0) {
      const found = findReply(reply.replies, replyId);
      if (found) return found;
    }
  }
  return null;
};

export const reportPost = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, reason } = req.body;

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const existingReport = post.reports.find(report => 
      report.userId.toString() === userId
    );
    
    if (existingReport) {
      return res.status(400).json({ message: "You've already reported this post" });
    }

    post.reports.push({ userId, reason });
    await post.save();

    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const resolveReport = async (req, res) => {
  try {
    const { id } = req.params;
    const { action } = req.body;

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (action === 'delete') {
      await Post.findByIdAndDelete(id);
      return res.status(200).json({ message: "Post deleted successfully" });
    } else {
      post.resolved = true;
      await post.save();
      return res.status(200).json(post);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const reportComment = async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    const { userId, reason } = req.body;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const comment = post.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    const existingReport = comment.reports.find(report => 
      report.userId.toString() === userId
    );
    
    if (existingReport) {
      return res.status(400).json({ message: "You've already reported this comment" });
    }

    comment.reports.push({ userId, reason });
    await post.save();

    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const reportReply = async (req, res) => {
  try {
    const { postId, commentId, replyId } = req.params;
    const { userId, reason } = req.body;

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

    if (!reply.reports) {
      reply.reports = [];
    }

    const existingReport = reply.reports.find(report => 
      report.userId.toString() === userId
    );
    
    if (existingReport) {
      return res.status(400).json({ message: "You've already reported this reply" });
    }

    reply.reports.push({ userId, reason });
    await post.save();

    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};