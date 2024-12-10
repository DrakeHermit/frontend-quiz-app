import { QuizService } from "./quiz-service.js";
import CustomButton from "./components/CustomButton.js";
import ProgressBar from "./components/ProgressBar.js";

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

      const title = document.querySelector(".main__heading");
      title.textContent = question.question;
      title.style.fontSize = "36px";
      const progress = document.getElementById("remove");
      progress.innerHTML = "";

      const buttonsContainer = document.querySelector(".buttons");
      const questionInfoContainer = document.querySelector(".main__left");

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
      this.addSubmitButton(buttonsContainer);
      this.addProgressBar(questionInfoContainer);
      console.log(this.questions);
      this.addOnAnswerListeners();
    } else {
      console.log("Quiz completed!");
    }
  }

  addSubmitButton(container) {
    const button = document.createElement("custom-button");
    container.appendChild(button);
  }

  addProgressBar(container) {
    const progressBar = document.createElement("progress-bar");
    container.appendChild(progressBar);
  }

  addCategoryDescription(data) {
    const categoryContainer = document.querySelector(".theme-toggle");
    const categoryDescriptionDiv = document.createElement("div");
    categoryDescriptionDiv.innerHTML = `
      <img src=${data.icon} alt="Category picture" />
      <h2>${data.title}</h2>
    `;

    categoryContainer.appendChild(categoryDescriptionDiv);
  }
}
