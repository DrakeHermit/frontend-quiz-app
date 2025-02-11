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
      quizFinished: false,
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
      selectedCategory: category,
      currentQuestionIndex: 0,
      selectedAnswer: null,
      isLastQuestion: questions.length === 1,
    });
  }

  handleButtonClick() {
    switch (this.state.phase) {
      case "answering":
        if (this.state.selectedAnswer === null) {
          this.setState({ showError: true });
          return;
        }

        if (this.state.selectedAnswer !== null) {
          const isCorrect = this.validateAnswer(this.state.selectedAnswer);
          const correctAnswerIndex = this.getCurrentQuestion().options.findIndex(
            (option) => option === this.getCurrentQuestion().answer
          );
          this.setState({
            phase: "answered",
            score: isCorrect ? this.state.score + 1 : this.state.score,
            isCorrect,
            correctAnswerIndex,
            showError: false,
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

      case "finished":
        if (this.state.quizFinished) {
          this.setState({
            currentQuestionIndex: 0,
            questions: [],
            score: 0,
            selectedCategory: null,
            quizFinished: true,
          });
        }
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
