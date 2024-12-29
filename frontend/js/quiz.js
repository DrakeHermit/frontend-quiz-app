import { QuizService } from "./quiz-service.js";
import CustomButton from "./components/CustomButton.js";
import ProgressBar from "./components/ProgressBar.js";

export class Quiz {
  constructor() {
    this.service = new QuizService();
    this.currentQuestionIndex = 0;
    this.questions = [];
    this.progressBar = null;
    this.currentButton;
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
    const selectedBtn = this.handleQuestionSubmit();
    if (selectedBtn) {
      this.validateAnswer();
    } else {
      console.log("Select an answer");
    }
  }

  async handleCategoryClick(e) {
    const category = e.currentTarget.dataset.category;
    this.questions = await this.service.fetchQuestions(category);
    this.removeEventListeners();
    this.addCategoryDescription(category);
    this.displayQuestion();
  }

  handleQuestionSubmit() {
    const buttons = document.querySelectorAll(".button__group");
    let selectedBtn;
    buttons.forEach((button) => {
      if (button.classList.contains("isSelected")) selectedBtn = button;
    });
    return selectedBtn;
  }

  displayQuestion() {
    if (this.currentQuestionIndex <= this.questions.length - 1) {
      const letters = ["A", "B", "C", "D"];
      const question = this.questions[this.currentQuestionIndex];

      const title = document.querySelector(".main__heading");
      title.textContent = question.question;
      title.style.fontSize = "36px";

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
      const submitBtn = this.addSubmitButton(buttonsContainer);
      buttonsContainer.appendChild(submitBtn);
      this.currentButton = submitBtn;
      this.btnSelected();
      const questionInfoContainer = document.querySelector(".main__left");
      this.initializeProgressBar(questionInfoContainer);
      this.updateProgress();
      questionInfoContainer.querySelector(".progress-display")?.remove();
      questionInfoContainer.querySelector("p")?.remove();
      this.addNumericalProgress(
        questionInfoContainer,
        this.currentQuestionIndex
      );
    } else {
      console.log("Quiz completed!");
    }
  }

  handleNextQuestion() {
    console.log("handleNextQuestion called");
    console.log("Timeout finished, moving to next question");
    this.currentQuestionIndex++;
    this.displayQuestion();
  }

  addSubmitButton() {
    const button = document.createElement("custom-button");
    button.setState("submit");
    button.handleClick = this.handleAnswer.bind(this);
    button.nextQuestion = this.handleNextQuestion.bind(this);
    return button;
  }

  validateAnswer() {
    if (this.currentButton) {
      console.log("Before state change:", this.currentButton.state);
      this.currentButton.setState("next");
      console.log("After state change:", this.currentButton.state);
    }
  }

  initializeProgressBar(container) {
    if (!this.progressBar) {
      this.progressBar = document.createElement("progress-bar");
      container.appendChild(this.progressBar);
    }
  }

  updateProgress() {
    if (this.progressBar) {
      this.progressBar.updateProgress(
        this.currentQuestionIndex + 1,
        this.questions.length
      );
    }
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
    categoryContainer.style.visibility = "visible";
  }

  addNumericalProgress(element, questionNumber) {
    element.insertAdjacentHTML(
      "afterbegin",
      `
        <div class="progress-display">Question ${questionNumber + 1} of 10</div>
      `
    );
  }
}
