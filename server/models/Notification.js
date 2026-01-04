import mongoose from "mongoose";

const notificationSchema = mongoose.Schema(
  {
    userId: { type: String, required: true }, 
    senderId: { type: String, required: true }, 
    senderName: { type: String, required: true },
    senderPicture: { type: String },
    postId: { type: String }, 
    commentId: { type: String }, 
    type: { type: String, enum: ["like", "comment", "reply"], required: true },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Notification = mongoose.model("Notification", notificationSchema);
export default Notification;