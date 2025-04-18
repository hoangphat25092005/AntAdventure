const express = require("express");
const cors = require("cors");
const connectDB = require("./config/database");
const authRoutes = require("./routing/auth.route");
const feedbackRoutes = require("./routing/feedback.route");
const questionsRoutes = require("./routing/questions.route");
require("dotenv").config({ path: "./config/.env" });

const app = express();
connectDB();

app.use(express.json()); // Middleware to parse JSON body
//cors for frontend and backend
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));


app.use("/auth", authRoutes);
app.use("/feedback", feedbackRoutes);
app.use("/questions", questionsRoutes);

app.use((err, req, res, next) => {
    console.error("❌ Error:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
});

const PORT = process.env.PORT || 3002;

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
