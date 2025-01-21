import { QuizService } from "./quiz-service.js";

export class QuizStateManager {
  constructor() {
    this.service = new QuizService();
    this.state = {
      buttonState: "submit",
      isLastQuestion: false,
      isQuizComplete: false,
      isLoading: false,
      currentQuestionIndex: 0,
      questions: [],
      selectedCategory: null,
      selectedBtn: null,
      error: null,
      score: 0,
    };
    this.subscribers = [];
  }

  async handleCategorySelection(category, selectedBtn) {
    try {
      this.setState({
        selectedCategory: category,
        selectedBtn: selectedBtn,
        questions: [],
        currentQuestionIndex: 0,
        buttonState: "submit",
        isLastQuestion: false,
        isQuizComplete: false,
        score: 0,
      });

      const questions = await this.service.fetchQuestions(category);

      this.setState({
        questions,
        buttonState: "submit",
      });

      return true;
    } catch (error) {
      this.setState({
        error: error.message,
        isLoading: false,
      });
      return false;
    }
  }

  handleNextQuestion() {
    const nextIndex = this.state.currentQuestionIndex + 1;

    if (nextIndex >= this.state.questions.length) {
      this.handleFinish();
      return;
    }

    const isLastQuestion = nextIndex === this.state.questions.length - 1;

    this.setState({
      currentQuestionIndex: nextIndex,
      buttonState: "submit",
      isLastQuestion: isLastQuestion,
    });
  }

  handleButtonClick() {
    if (this.state.isQuizComplete) return;

    switch (this.state.buttonState) {
      case "submit":
        this.handleSubmit();
        break;
      case "next":
        this.handleNextQuestion();
        break;
      case "finish":
        this.handleFinish();
        break;
    }
  }

  handleSubmit() {
    console.log(this.state.selectedBtn);

    if (!this.state.selectedBtn) {
      console.log("Select an answer");
      this.setState({ buttonState: "submit" });
    }

    const nextState = this.state.isLastQuestion
      ? { buttonState: "finish" }
      : { buttonState: "next" };

    this.setState(nextState);
  }

  handleFinish() {
    this.setState({
      buttonState: "finish",
      isQuizComplete: true,
    });
  }

  calculateScore() {
    return this.state.score + 1;
  }

  getCurrentQuestion() {
    if (!this.state.questions || this.state.questions.length === 0) {
      return null;
    }
    return this.state.questions[this.state.currentQuestionIndex];
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
}
