import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";

import connectDB from "./config/database.js";
import authRoutes from "./routes/authRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import fileRoutes from "./routes/fileRoutes.js";
import subscriberRoutes from "./routes/subscriberRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";

dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(helmet());
app.use(cors({
  origin: [process.env.FRONTEND_CORS, process.env.ADMIN_CORS],
  credentials: true,
}));
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/post", postRoutes); // Alternative route for single post operations
app.use("/api/categories", categoryRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/files", fileRoutes);
app.use("/api/upload", fileRoutes);
app.use("/api/subscriber", subscriberRoutes);
app.use("/api/client", messageRoutes);
app.use("/api/admin", messageRoutes);

// Health Check
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Server is running",
    timestamp: new Date(),
  });
});

// 404 Handler
app.use(notFoundHandler);

// Error Handler
app.use(errorHandler);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
});

export default app;
