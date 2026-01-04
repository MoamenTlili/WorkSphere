import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
    {
        firstName: { type: String, required: true, min: 2, max: 30},
        lastName: { type: String, required: true, min: 2, max: 30 },
        email: { type: String, required: true, max: 50, unique: true},
        password: { type: String, required: true, min: 10 },
        picturePath: { type: String, default: "" },
        friends: { type: Array, default: [] },
        location: String,
        department: String,
        viewedProfile: Number,
        impressions: Number,
        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user",
          },
          isAdmin: {
            type: Boolean,
            default: false,
          },
    }, 
    { timestamps: true}
)

const User = mongoose.model("User", UserSchema);
export default User;   