const mongoose = require("mongoose");
const Post = require("./models/Post"); 

const updateComments = async () => {
  try {
    await mongoose.connect(process.env.Mongo_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Connected to MongoDB");

    const posts = await Post.find({});

    for (const post of posts) {
      let isUpdated = false;

      for (const comment of post.comments) {
        if (!comment.likes) {
          comment.likes = new Map(); 
          isUpdated = true;
        }

        for (const reply of comment.replies) {
          if (!reply.likes) {
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

    console.log("Comments updated successfully");
  } catch (error) {
    console.error("Error updating comments:", error);
  } finally {
    mongoose.connection.close();
  }
};

updateComments();