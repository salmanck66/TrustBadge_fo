import express from "express";
import connectDB from "./db/mongo.js";
import saveBadgesRoute from "./app/routes/api/save-selected-badges.js";
import getBadgesRoute from "./app/routes/api/get-selected-badges.js";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware to parse JSON
app.use(express.json());

// API Routes
app.use(saveBadgesRoute);
app.use(getBadgesRoute);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
