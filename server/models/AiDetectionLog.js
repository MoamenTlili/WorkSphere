import mongoose from "mongoose";

const AiDetectionLogSchema = new mongoose.Schema(
  {
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
    content: { 
      type: String, 
      required: true 
    },
    probability: { 
      type: Number, 
      required: true,
      min: 0,
      max: 1
    },
    contentType: {
      type: String,
      enum: ["post", "comment", "reply"],
      required: true
    },
    relatedPost: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: function() {
        return this.contentType !== "post";
      }
    },
    originalContent: {
      type: String,
      required: function() {
        return this.contentType !== "post";
      }
    },
    wasBlocked: { 
      type: Boolean, 
      default: true 
    },
    userAgent: { 
      type: String 
    },
    ipAddress: { 
      type: String 
    },
    error: {
      type: String
    }
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },  
    toObject: { virtuals: true }  
  }
);
AiDetectionLogSchema.virtual('user', {
  ref: 'User',
  localField: 'userId',
  foreignField: '_id',
  justOne: true,
  options: { select: 'firstName lastName email picturePath' } 
});
export default mongoose.model("AiDetectionLog", AiDetectionLogSchema);