import mongoose from "mongoose";
import dotenv from "dotenv";
import Post from "./models/Post.js";

dotenv.config();

async function updateReplies() {
  try {
    if (!process.env.MONGO_URI) {
        throw new Error("MONGO_URI is not defined in .env file");
    }

    await mongoose.connect(process.env.MONGO_URI);

    console.log("Connected to MongoDB");

    const posts = await Post.find({});

    for (const post of posts) {
      let isUpdated = false;

      if (!post.firstName || !post.lastName) {
        post.firstName = "Unknown";
        post.lastName = "User";
        isUpdated = true;
      }

      for (const comment of post.comments) {
        for (const reply of comment.replies) {
          if (reply.likes && Object.keys(reply.likes).length === 0) {
            reply.likes = new Map();
            isUpdated = true;
          }
        }
      }

      if (isUpdated) {
        await post.save();
        console.log(`Updated post: ${post._id}`);
      }
    }

    console.log("Replies updated successfully");
  } catch (error) {
    console.error("Error updating replies:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
}

updateReplies();