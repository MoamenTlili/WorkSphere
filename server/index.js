import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/users.routes.js";  
import postRoutes from "./routes/posts.routes.js";
import notificationRoutes from "./routes/notifications.routes.js"; 
import {createPost} from "./controllers/posts.controllers.js";
import { register } from "./controllers/auth.controllers.js";
import { verifyToken } from "./middleware/auth.middleware.js";
import { updateUser } from "./controllers/users.controllers.js";
import adminRoutes from "./routes/admin.routes.js";
import { verifyContent } from './middleware/contentVerification.middleware.js';
import { createServer } from "http";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";

/*Configs*/
const __filename = fileURLToPath(import.meta.url);
const __dirname= path.dirname(__filename);
dotenv.config();
const app = express();
app.use(express.json())
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({policy: "cross-origin"}));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true}));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true}));
app.use(cors());

app.use("/assets", express.static(path.join(__dirname, 'public/assets')));

//File storage_ to save uploaded files
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "uploads/"); 
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname); 
    },
  });
  
const upload = multer({storage});
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.post("/auth/register", upload.single("picture"), register);
app.post("/posts", verifyToken, upload.single("picture"), verifyContent, createPost);
app.patch("/users/:id", verifyToken, upload.single("picture"), updateUser);

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/posts", postRoutes);       
app.use("/notifications", notificationRoutes);
app.use("/admin", adminRoutes);

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173", 
    methods: ["GET", "POST"],
    credentials: true
  }
});
global.activeUserConnections = new Map(); 
global.socketUserMap = new Map(); 
io.on("connection", (socket) => {
  console.log("--- A client is trying to connect to Socket.IO! ---");
  console.log(`User connected via WebSocket: ${socket.id}`);

  const token = socket.handshake.auth.token;
  if (token) {
    try {
      const verified = jwt.verify(token, process.env.JWT_SECRET);
      const userId = verified.id;

      console.log(`User ${userId} authenticated for socket ${socket.id}`);
      
      socketUserMap.set(socket.id, userId);

      if (!activeUserConnections.has(userId)) {
        activeUserConnections.set(userId, new Set());
      }
      activeUserConnections.get(userId).add(socket.id);

      // If this is the first connection for this user, notify all clients
      if (activeUserConnections.get(userId).size === 1) {
        io.emit("user_online", { userId });
        console.log(`User ${userId} is now online (first connection).`);
      }

      socket.emit("active_users_list", Array.from(activeUserConnections.keys()));

    } catch (err) {
      console.error("Socket authentication error:", err.message);
      socket.emit("auth_error", { message: "Invalid token" });
      socket.disconnect(); 
      return;
    }
  } else {
      console.log("No token provided for socket connection, disconnecting.");
      socket.emit("auth_error", { message: "No token provided" });
      socket.disconnect();
      return;
  }

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
    const userId = socketUserMap.get(socket.id);

    if (userId && activeUserConnections.has(userId)) {
      activeUserConnections.get(userId).delete(socket.id);
      socketUserMap.delete(socket.id);

      if (activeUserConnections.get(userId).size === 0) {
        activeUserConnections.delete(userId); 
        io.emit("user_offline", { userId });
        console.log(`User ${userId} is now offline (last connection closed).`);
      }
    }
  });
});

const PORT = process.env.PORT || 6001;
mongoose.connect(process.env.Mongo_URL, {
    useNewUrlParser: true, 
}).then(() => {
    httpServer.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
}).catch((error) => console.log(`${error} did not connect`));