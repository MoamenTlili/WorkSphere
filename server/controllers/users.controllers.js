import User from "../models/Users.js";  
import Post from "../models/Post.js";
import mongoose from "mongoose";
import bcrypt from "bcrypt";

/* Get User */
export const getUser = async (req, res) => {
    try {
        const {id} = req.params;
        const user = await User.findById(id);
        res.status(200).json(user);
    } catch (e) {
        res.status(404).json({ message: e.message });
    }
}

/* Get User Friends */
export const getUserFriends = async (req, res) => {
    try {
        const {id} = req.params;
        const user = await User.findById(id);

        const friends = await Promise.all(
            user.friends.map((id) => User.findById(id))
        );
        
        const formattedFriends = friends.map(
            ({_id, firstName, lastName, department, location, picturePath}) => {
                return {_id, firstName, lastName, department, location, picturePath};
            }
        );
        
        res.status(200).json(formattedFriends);
    } catch (e) {
        res.status(404).json({ message: e.message });
    }
};

/* Update User Content References */
async function updateUserContentReferences(userId, updates) {
    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
        const userIdObj = new mongoose.Types.ObjectId(userId);

        // Update user's own posts
        if (updates.firstName || updates.lastName || updates.picturePath) {
            const postUpdates = {};
            if (updates.firstName) postUpdates.firstName = updates.firstName;
            if (updates.lastName) postUpdates.lastName = updates.lastName;
            if (updates.picturePath) {
                postUpdates.userPicturePath = updates.picturePath;
            }

            await Post.updateMany(
                { userId: userIdObj },
                { $set: postUpdates },
                { session }
            );
        }

        // Update comments by the user
        if (updates.firstName || updates.lastName || updates.picturePath) {
            const commentUpdates = {};
            if (updates.firstName) {
                commentUpdates["comments.$[elem].firstName"] = updates.firstName;
            }
            if (updates.lastName) {
                commentUpdates["comments.$[elem].lastName"] = updates.lastName;
            }
            if (updates.firstName || updates.lastName) {
                commentUpdates["comments.$[elem].userName"] = 
                    `${updates.firstName || ''} ${updates.lastName || ''}`.trim();
            }
            if (updates.picturePath) {
                commentUpdates["comments.$[elem].userPicturePath"] = updates.picturePath;
            }

            await Post.updateMany(
                { "comments.userId": userIdObj },
                { $set: commentUpdates },
                { 
                    arrayFilters: [{ "elem.userId": userIdObj }],
                    session 
                }
            );
        }

        // Update replies by the user
        if (updates.firstName || updates.lastName || updates.picturePath) {
            const replyUpdates = {};
            if (updates.firstName) {
                replyUpdates["comments.$[].replies.$[reply].firstName"] = updates.firstName;
            }
            if (updates.lastName) {
                replyUpdates["comments.$[].replies.$[reply].lastName"] = updates.lastName;
            }
            if (updates.firstName || updates.lastName) {
                replyUpdates["comments.$[].replies.$[reply].userName"] = 
                    `${updates.firstName || ''} ${updates.lastName || ''}`.trim();
            }
            if (updates.picturePath) {
                replyUpdates["comments.$[].replies.$[reply].userPicturePath"] = updates.picturePath;
            }

            await Post.updateMany(
                { "comments.replies.userId": userIdObj },
                { $set: replyUpdates },
                { 
                    arrayFilters: [{ "reply.userId": userIdObj }],
                    session 
                }
            );
        }

        await session.commitTransaction();
    } catch (error) {
        await session.abortTransaction();
        console.error("Error updating user content references:", error);
        throw error;
    } finally {
        session.endSession();
    }
}

/* Update User */
export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { firstName, lastName, email, location, department, currentPassword, newPassword } = req.body;
        
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const updates = {};
        const needsContentUpdate = {};
        
        if (firstName && firstName !== user.firstName) {
            updates.firstName = firstName;
            needsContentUpdate.firstName = firstName;
            user.firstName = firstName;
        }
        
        if (lastName && lastName !== user.lastName) {
            updates.lastName = lastName;
            needsContentUpdate.lastName = lastName;
            user.lastName = lastName;
        }
        
        if (email && email !== user.email) {
            updates.email = email;
            user.email = email;
        }
        
        if (location) {
            updates.location = location;
            user.location = location;
        }
        
        if (department) {
            updates.department = department;
            user.department = department;
        }

        // Handle password change
        if (currentPassword && newPassword) {
            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: "Current password is incorrect" });
            }
            const salt = await bcrypt.genSalt();
            user.password = await bcrypt.hash(newPassword, salt);
        }

        //profile pic
        if (req.file) {
            const newPicturePath = `/uploads/${req.file.filename}`;
            updates.picturePath = newPicturePath;
            needsContentUpdate.picturePath = newPicturePath;
            user.picturePath = newPicturePath;
        }

        const updatedUser = await user.save();
        
        // Update all related content if needed
        if (Object.keys(needsContentUpdate).length > 0) {
            await updateUserContentReferences(id, needsContentUpdate);
        }

        const userToReturn = updatedUser.toObject();
        delete userToReturn.password;

        res.status(200).json(userToReturn);
    } catch (e) {
        console.error("Error in updateUser:", e);
        res.status(500).json({ message: e.message });
    }
};

/* Search Users */
export const searchUsers = async (req, res) => {
    try {
        const { query } = req.params;
        const users = await User.find({
            $or: [
                { firstName: { $regex: query, $options: "i" } },
                { lastName: { $regex: query, $options: "i" } }
            ]
        }).limit(5);
        
        res.status(200).json(users);
    } catch (e) {
        res.status(404).json({ message: e.message });
    }
};

/* Add or remove friend */
export const addRemoveFriend = async (req, res) => {
    try {
        const { id, friendId } = req.params;
        const user = await User.findById(id);
        const friend = await User.findById(friendId);

        if (!user || !friend) {
            return res.status(404).json({ message: "User not found" });
        }

        const isFriend = user.friends.includes(friendId);
        
        if (isFriend) {
            // Remove friend
            user.friends = user.friends.filter(id => id.toString() !== friendId);
            friend.friends = friend.friends.filter(id => id.toString() !== id);
        } else {
            // Add friend
            user.friends.push(friendId);
            friend.friends.push(id);
        }

        await user.save();
        await friend.save();

        // Get updated friends list
        const friends = await Promise.all(
            user.friends.map(id => User.findById(id))
        );
        
        const formattedFriends = friends.map(
            ({ _id, firstName, lastName, department, location, picturePath }) => {
                return { _id, firstName, lastName, department, location, picturePath };
            }
        );

        res.status(200).json(formattedFriends);
    } catch (e) {
        res.status(404).json({ message: e.message });
    }
};

export const getUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 7;
    const skip = (page - 1) * limit;

    const users = await User.find()
      .select('-password')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const totalCount = await User.countDocuments();

    res.status(200).json({
      users,
      totalCount,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit)
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};