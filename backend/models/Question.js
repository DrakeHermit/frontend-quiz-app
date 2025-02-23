import mongoose from "mongoose";

const questionSchema = mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  options: {
    type: [String],
    required: true,
  },
  answer: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: ["html", "css", "javascript", "accessibility"],
  },
});

const Question = mongoose.model("Question", questionSchema, "quiz-data");

export default Question;
