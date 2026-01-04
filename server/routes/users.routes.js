import express from "express";
import {
    getUser,
    getUserFriends,
    addRemoveFriend,
    searchUsers,
    getUsers
} from "../controllers/users.controllers.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/:id", verifyToken, getUser);
router.get("/:id/friends", verifyToken, getUserFriends);
router.get("/search/:query", verifyToken, searchUsers);
router.get("/", verifyToken, getUsers);

router.patch("/:id/:friendId", verifyToken, addRemoveFriend);

export default router;