import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import usersRoutes from "./routes/users.js";
import authRoutes from "./auth/auth.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

// MongoDB Connection
const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/CRUD");
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("Failed to connect to MongoDB:", err);
    process.exit(1); // Exit if MongoDB connection fails
  }
};

connectDB();

// Routes
app.use("/users", usersRoutes);
app.use("/auth", authRoutes); // Authentication routes

// Default Route
app.get("/", (req, res) => res.send("Hello from Homepage."));

// Start Server
app.listen(PORT, () =>
  console.log(`Server running on port: http://localhost:${PORT}`)
);
