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
    document.querySelectorAll(".button__group").forEach((button) =>
      button.addEventListener("click", (e) => this.handleAnswer(e), {
        once: true,
      })
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
    this.removeEventListeners();
    this.displayQuestion();
  }

  displayQuestion() {
    if (this.currentQuestionIndex <= this.questions.length - 1) {
      const letters = ["A", "B", "C", "D"];
      const question = this.questions[this.currentQuestionIndex];

      // Selectors
      const title = document.querySelector(".main__heading");
      title.textContent = question.question;
      title.style.fontSize = "36px";
      const progress = document.getElementById("remove");
      progress.innerHTML = "";

      const buttonsContainer = document.querySelector(".buttons");

      const html = `
        <ul>
            ${question.options
              .map(
                (option, index) => `
                <li>
                    <button class="button__group" data-answer="${index}">
                        <div class="img-wrapper bold-big">
                            ${letters[index]}
                        </div>
                        <span>${option
                          .replace(/</g, "&lt;")
                          .replace(/>/g, "&gt;")}</span>
                    </button>
                </li>
            `
              )
              .join("")}
        </ul>
    `;

      buttonsContainer.innerHTML = html;
      this.addOnAnswerListeners();
    } else {
      console.log("Quiz completed!");
    }
  }
}
