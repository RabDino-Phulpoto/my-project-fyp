const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB Connection Logic
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ Successfully connected to Local MongoDB (Compass)");
    } catch (err) {
        console.error("❌ MongoDB connection error:", err.message);
        process.exit(1); // Stop the server if connection fails
    }
};

connectDB();

// Test Route
app.get('/', (req, res) => {
    res.send("API is running and connected to local MongoDB!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server started on http://localhost:${PORT}`);
});