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

  removeEventListeners() {
    document
      .querySelectorAll("[data-category]")
      .forEach((button) => button.replaceWith(button.cloneNode(true)));
  }

  btnSelected() {
    const checkedBtn = document.querySelectorAll(".button__group");

    checkedBtn.forEach((button) => {
      button.addEventListener("click", () => {
        checkedBtn.forEach((btn) => btn.classList.remove("isSelected"));
        button.classList.add("isSelected");
      });
    });
  }

  handleAnswer() {
    this.currentQuestionIndex++;
    this.displayQuestion();
  }

  async handleCategoryClick(e) {
    const category = e.currentTarget.dataset.category;
    console.log(category);
    this.questions = await this.service.fetchQuestions(category);
    this.removeEventListeners();
    this.addCategoryDescription(category);
    this.displayQuestion();
  }

  displayQuestion() {
    if (this.currentQuestionIndex <= this.questions.length - 1) {
      const letters = ["A", "B", "C", "D"];
      const question = this.questions[this.currentQuestionIndex];

      const title = document.querySelector(".main__heading");
      title.textContent = question.question;
      title.style.fontSize = "36px";

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
      const submitBtn = this.addSubmitButton(buttonsContainer);
      buttonsContainer.appendChild(submitBtn);
      this.addProgressBar(questionInfoContainer);
      this.btnSelected();
      questionInfoContainer.querySelector("p")?.remove();
      this.addNumericalProgress(
        questionInfoContainer,
        this.currentQuestionIndex
      );
    } else {
      console.log("Quiz completed!");
    }
  }

  addSubmitButton() {
    const button = document.createElement("custom-button");
    button.handleClick = this.handleAnswer.bind(this);
    return button;
  }

  addProgressBar(container) {
    const progressBar = document.createElement("progress-bar");
    container.appendChild(progressBar);
  }

  addCategoryDescription(category) {
    const categoryStyles = {
      html: "orange",
      css: "green",
      javascript: "blue",
      accessibility: "purple",
    };

    const categoryObj = {
      title: category.toUpperCase(),
      pictureSrc: `/frontend/assets/images/icon-${category}.svg`,
      bgColor: categoryStyles[category],
    };

    const categoryContainer = document.querySelector(".description");
    categoryContainer.innerHTML = `
     <div class="category-description">
       <div class="img-wrapper ${categoryObj.bgColor}"><img src=${categoryObj.pictureSrc} alt="Category picture" /></div>
        <h2>${categoryObj.title}</h2>
     </div>
    `;
    categoryContainer.style.opacity = "1";
    categoryContainer.style.visibility = "1";
  }

  addNumericalProgress(element, questionNumber) {
    element.insertAdjacentHTML(
      "afterbegin",
      `
        <p>Question ${questionNumber + 1} of 10</p>
      `
    );
  }
}
