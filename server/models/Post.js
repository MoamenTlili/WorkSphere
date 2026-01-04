import mongoose from "mongoose";

const replySchema = new mongoose.Schema({
  userId: String,
  userName: String,
  userPicturePath: String,
  comment: String,
  likes: {
    type: Map,
    of: Boolean,
    default: () => new Map()  
  },
  replies: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Reply" 
  }], 
  reports: [
    {
      userId: String,
      reason: String,
      reportedAt: { type: Date, default: Date.now },
      resolved: { type: Boolean, default: false }
    }
  ],
  createdAt: { type: Date, default: Date.now }
}, { _id: true });

const Reply = mongoose.model("Reply", replySchema);

const postSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    location: String,
    description: String,
    picturePath: String,
    userPicturePath: String,
    likes: {
      type: Map,
      of: Boolean,
      default: () => new Map(), 
    },
    comments: [
      {
        userId: String,
        userName: String,
        userPicturePath: String,
        comment: String,
        likes: {
          type: Map,
          of: Boolean,
          default: () => new Map(),  
        },
        replies: [replySchema], 
        reports: [
          {
            userId: String,
            reason: String,
            reportedAt: { type: Date, default: Date.now },
            resolved: { type: Boolean, default: false }
          }
        ],
        resolved: { type: Boolean, default: false }
      },
    ],
    reports: [
      {
        userId: String,
        reason: String,
        reportedAt: { type: Date, default: Date.now },
        resolved: { type: Boolean, default: false }
      }
    ],
    resolved: { type: Boolean, default: false }
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);
console.log("Post model registered successfully");

export default Post;