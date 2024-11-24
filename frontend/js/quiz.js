import { QuizService } from "./quiz-service.js";

export class Quiz {
  constructor() {
    this.service = new QuizService();
    this.currentQuestion = 0;
    this.questions = [];
    this.init();
  }

  init() {
    this.addEventListeners();
  }

  addEventListeners() {
    document
      .querySelectorAll("[data-category]")
      .forEach((button) =>
        button.addEventListener("click", (e) => this.handleCategoryClick(e))
      );
  }

  async handleCategoryClick(e) {
    const category = e.currentTarget.dataset.category;
    this.questions = await this.service.fetchQuestions(category);
    console.log(this.questions);
  }
}
