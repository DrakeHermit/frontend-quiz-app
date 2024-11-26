import { QuizService } from "./quiz-service.js";

export class Quiz {
  constructor() {
    this.service = new QuizService();
    this.currentQuestionIndex = 0;
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

  addOnAnswerListeners() {
    document
      .querySelectorAll(".button__group")
      .forEach((button) =>
        button.addEventListener("click", (e) => this.handleAnswer(e))
      );
  }

  removeEventListeners() {
    document
      .querySelectorAll("[data-category]")
      .forEach((button) => button.replaceWith(button.cloneNode(true)));
  }

  handleAnswer(e) {
    this.currentQuestionIndex++;
    this.displayQuestion();
  }

  async handleCategoryClick(e) {
    const category = e.currentTarget.dataset.category;
    this.questions = await this.service.fetchQuestions(category);
    this.displayRandomQuestion();
  }

  displayRandomQuestion() {
    const randomIndex = Math.floor(Math.random() * this.questions.length);
    const question = this.questions[randomIndex];

    // Selectors
    const title = document.querySelector(".main__heading");
    title.textContent = question.question;
    title.style.fontSize = "36px";
    const progress = document.getElementById("remove");
    progress.innerHTML = "";
    const answerText = document.querySelectorAll(".button__group span");
    answerText.forEach((answer, index) => {
      answer.textContent = question.options[index];
    });
    const answerChoice = document.querySelectorAll(".img-wrapper");
    const letters = ["A", "B", "C", "D"];
    answerChoice.forEach(
      (choice, index) =>
        (choice.innerHTML = `
        <div class="img-wrapper bold-big">
          ${letters[index]}
        </div> 
      `)
    );
  }
}
