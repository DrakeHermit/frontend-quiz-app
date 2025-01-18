import { QuizService } from "./quiz-service.js";

export class QuizStateManager {
  constructor() {
    this.service = new QuizService();
    this.state = {
      buttonState: "submit",
      isLastQuestion: false,
      isLoading: false,
      currentQuestionIndex: 0,
      questions: [],
      selectedCategory: null,
      error: null,
      score: 0,
    };
    this.subscribers = [];
  }

  async handleCategorySelection(category) {
    try {
      const questions = await this.service.fetchQuestions(category);
      this.setState({
        questions,
        selectedCategory: category,
        currentQuestionIndex: 0,
        buttonState: "submit",
        isLastQuestion: false,
        isQuizComplete: false,
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  setState(newState) {
    this.state = { ...this.state, ...newState };
    this.notifySubscribers();
  }

  subscribe(callback) {
    this.subscribers.push(callback);

    callback(this.state);
  }

  notifySubscribers() {
    this.subscribers.forEach((callback) => callback(this.state));
  }

  getCurrentQuestion() {
    if (!this.state.questions || this.state.questions.length === 0) {
      return null;
    }
    return this.state.questions[this.state.currentQuestionIndex];
  }

  handleButtonClick() {
    switch (this.state.buttonState) {
      case "submit":
        // After submitting an answer, change to next or finish state
        if (this.state.isLastQuestion) {
          this.setState({ buttonState: "finish" }); // New state for finish
        } else {
          this.setState({ buttonState: "next" });
        }
        break;

      case "next":
        this.handleNextQuestion();
        break;

      case "finish":
        // Handle finishing the quiz
        this.handleFinish();
        break;
    }
  }

  handleNextQuestion() {
    const nextIndex = this.state.currentQuestionIndex + 1;

    // Check if next question will be the last one
    if (nextIndex === this.state.questions.length - 1) {
      this.setState({ isLastQuestion: true });
      console.log("Last question", this.state.isLastQuestion);
    }

    this.setState({
      currentQuestionIndex: nextIndex,
      buttonState: "submit", // Reset to submit for new question
    });
  }

  handleFinish() {
    this.setState({
      buttonState: "finish",
      isQuizComplete: true,
    });
  }

  updateScore(newScore) {
    this.setState({ score: newScore });
  }
}
