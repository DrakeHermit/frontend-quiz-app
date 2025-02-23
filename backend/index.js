import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import Question from "./models/Question.js";

dotenv.config();
const app = express();

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
  console.log("Route hit!");
  try {
    console.log("Fetching all questions");

    // Detailed model and collection logging
    console.log(`Model Name: ${Question.modelName}`);
    console.log(`Collection Name: ${Question.collection.collectionName}`);

    // Use .lean() to get plain JavaScript objects
    const questions = await Question.find().lean();

    // Detailed logging of found questions
    console.log("Total Questions Found:", questions.length);
    console.log(
      "Sample Questions:",
      JSON.stringify(questions.slice(0, 2), null, 2)
    );

    if (questions.length === 0) {
      console.log("No questions found in database");
      return res.status(404).json({ message: "No questions found" });
    }

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
