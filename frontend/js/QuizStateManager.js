import { QuizService } from "./quiz-service.js";

export class QuizStateManager {
  constructor() {
    this.service = new QuizService();
    this.state = {
      phase: "answering",
      buttonState: "submit",
      currentQuestionIndex: 0,
      questions: [],
      selectedAnswer: null,
      score: 0,
      isLastQuestion: false,
      selectedCategory: null,
    };
    this.subscribers = [];
  }

  subscribe(callback) {
    this.subscribers.push(callback);
  }

  setState(newState) {
    this.state = { ...this.state, ...newState };
    this.subscribers.forEach((cb) => cb(this.state));
  }

  async handleCategorySelection(category) {
    const questions = await this.service.fetchQuestions(category);
    this.setState({
      phase: "answering",
      questions,
      selectedCategory: category, // Set the category
      currentQuestionIndex: 0,
      selectedAnswer: null,
      isLastQuestion: questions.length === 1,
    });
  }

  handleButtonClick() {
    switch (this.state.phase) {
      case "answering":
        if (this.state.selectedAnswer !== null) {
          const isCorrect = this.validateAnswer(this.state.selectedAnswer);
          this.setState({
            phase: "answered",
            score: isCorrect ? this.state.score + 1 : this.state.score,
          });
        }
        break;

      case "answered":
        if (this.state.isLastQuestion) {
          this.setState({ phase: "completed" });
        } else {
          const nextIndex = this.state.currentQuestionIndex + 1;
          this.setState({
            phase: "answering",
            currentQuestionIndex: nextIndex,
            selectedAnswer: null,
            isLastQuestion: nextIndex === this.state.questions.length - 1,
          });
        }
        break;
    }
  }

  moveToNextQuestion() {
    const nextIndex = this.state.currentQuestionIndex + 1;
    this.setState({
      phase: "answering",
      currentQuestionIndex: nextIndex,
      selectedAnswer: null,
      isLastQuestion: nextIndex === this.state.questions.length - 1,
    });
  }

  validateAnswer(selectedAnswer) {
    const currentQuestion = this.getCurrentQuestion();
    return currentQuestion.options[selectedAnswer] === currentQuestion.answer;
  }

  getCurrentQuestion() {
    return this.state.questions[this.state.currentQuestionIndex];
  }
}
