import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import Question from "./models/Question.js";
import cors from "cors";

dotenv.config();
const app = express();
app.use(cors({}));

// Connect to database
connectDB();

// Single route for getting questions by category
app.get("/api/questions/:category", async (req, res) => {
  try {
    const questions = await Question.find({ category: req.params.category });
    res.json(questions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/questions", async (req, res) => {
  try {
    const questions = await Question.find();
    res.json(questions);
  } catch (error) {
    console.error("Error fetching questions:", error);
    res.status(500).json({
      error: error.message,
      stack: error.stack,
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
