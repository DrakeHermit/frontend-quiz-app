import { QuizService } from "./quiz-service.js";
import { QuizStateManager } from "./QuizStateManager.js";
import CustomButton from "./components/CustomButton.js";
import ProgressBar from "./components/ProgressBar.js";

export class Quiz {
  constructor(stateManager) {
    this.stateManager = stateManager;
    this.progressBar = null;
    this.currentButton;

    this.stateManager.subscribe((state) => {
      if (state.showError) {
        this.addError();
      }

      if (state.phase === "answering") {
        this.displayQuestion();
      } else if (state.phase === "answered") {
        const buttons = document.querySelectorAll(".button__group");

        const selectedBtn = buttons[state.selectedAnswer];
        const correctBtn = buttons[state.correctAnswerIndex];

        if (state.isCorrect) {
          this.showAnswer(true, selectedBtn);
        } else {
          this.showAnswer(false, selectedBtn);
          this.showCorrectAnswer(correctBtn);
        }
      } else if (state.phase === "completed") {
        this.showResults();
      }
    });

    this.selectedCategory;
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

  updateButtonState() {
    if (this.currentButton) {
      const state = this.stateManager.state;
      if (state.phase === "answered" && state.isLastQuestion) {
        this.currentButton.textContent = "Finish Quiz";
      } else if (state.phase === "answered") {
        this.currentButton.textContent = "Next Question";
      } else {
        this.currentButton.textContent = "Submit Answer";
      }
    }
  }

  setupAnswerButtons() {
    const checkedBtn = document.querySelectorAll(".button__group");
    checkedBtn.forEach((button, index) => {
      if (index === this.stateManager.state.selectedAnswer) {
        button.classList.add("isSelected");
      }

      button.addEventListener("click", (e) => {
        checkedBtn.forEach((btn) => btn.classList.remove("isSelected"));
        e.currentTarget.classList.add("isSelected");
        this.stateManager.setState({
          selectedAnswer: index,
          showError: false,
        });
      });
    });
  }

  addError() {
    const errorField = document.querySelector(".main__right");
    const errorSign = "/frontend/assets/images/icon-incorrect.svg";
    const div = document.createElement("div");
    div.innerHTML = `
        <img class="error-mark" src=${errorSign} />
        <span class="error">Please select an answer</span>
    `;
    div.classList.add("error__field");
    errorField.appendChild(div);

    setTimeout(() => {
      errorField.removeChild(div);
    }, 1500);
  }

  showAnswer(answer, selectedBtn) {
    const correctAnswer = "/frontend/assets/images/icon-correct.svg";
    const incorrectAnswer = "/frontend/assets/images/icon-incorrect.svg";

    if (answer) {
      const div = document.createElement("div");
      div.innerHTML = `<img src=${correctAnswer}></img>`;
      div.classList.add("validate");
      selectedBtn.classList.remove("isSelected");
      selectedBtn.classList.add("correct-answer");
      div.style.visibility = "visible";
      div.style.opacity = "1";
      selectedBtn.appendChild(div);
    } else {
      const div = document.createElement("div");
      div.innerHTML = `<img src=${incorrectAnswer}></img>`;
      div.classList.add("validate");
      selectedBtn.classList.remove("isSelected");
      selectedBtn.classList.add("incorrect-answer");
      div.style.visibility = "visible";
      div.style.opacity = "1";
      selectedBtn.appendChild(div);
    }
  }

  showCorrectAnswer(correctBtn) {
    const correctAnswer = "/frontend/assets/images/icon-correct.svg";
    const div = document.createElement("div");
    div.innerHTML = `<img src=${correctAnswer}></img>`;
    div.classList.add("validate");
    div.style.visibility = "visible";
    div.style.opacity = "1";
    correctBtn.appendChild(div);
  }

  async handleCategoryClick(e) {
    const category = e.currentTarget.dataset.category;
    this.stateManager.handleCategorySelection(category);

    this.removeEventListeners();
    this.addCategoryDescription(category);
  }

  displayQuestion() {
    const currentQuestion = this.stateManager.getCurrentQuestion();
    const currentState = this.stateManager.state;

    if (
      currentState.currentQuestionIndex <=
      currentState.questions.length - 1
    ) {
      const letters = ["A", "B", "C", "D"];

      const title = document.querySelector(".main__heading");
      title.textContent = currentQuestion.question;
      title.style.fontSize = "36px";

      const buttonsContainer = document.querySelector(".buttons");

      const optionsArray = Array.isArray(currentQuestion.options)
        ? currentQuestion.options
        : [];

      const html = `
        <ul>
            ${optionsArray
              .map((option, index) => {
                return `
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
                `;
              })
              .join("")}
        </ul>
    `;

      buttonsContainer.innerHTML = html;
      const submitBtn = this.addSubmitButton();
      buttonsContainer.appendChild(submitBtn);
      this.currentButton = submitBtn;
      const questionInfoContainer = document.querySelector(".main__left");
      if (currentState.questions.length > 0) {
        this.initializeProgressBar(questionInfoContainer);
      }
      questionInfoContainer.querySelector(".progress-display")?.remove();
      questionInfoContainer.querySelector("p")?.remove();
      this.addNumericalProgress(
        questionInfoContainer,
        currentState.currentQuestionIndex
      );
      this.setupAnswerButtons();
    }
  }

  showResults() {
    const currentState = this.stateManager.state;
    const category = this.addCategoryDescription(currentState.selectedCategory);
    const resetBtn = this.addSubmitButton();
    const layout = document.querySelector(".main__content");

    layout.innerHTML = `
    <div class="main__left">
      <h2>Quiz Completed</h2>
      <h3>You scored...</h3>
    </div>
    <div class="main__right">
      <div class="score__box">
        ${category.innerHTML}
        <div class="score">${currentState.score}</div>
        <div class="total__score">out of ${currentState.questions.length}</div>
      </div>
    </div>
    `;

    const btnContainer = document.querySelector(".main__right");
    btnContainer.appendChild(resetBtn);
  }

  addSubmitButton() {
    const button = document.createElement("custom-button");
    button.stateManager = this.stateManager;
    return button;
  }

  initializeProgressBar(container) {
    if (!this.progressBar) {
      this.progressBar = document.createElement("progress-bar");
      this.progressBar.stateManager = this.stateManager;
      container.appendChild(this.progressBar);
    }
  }

  addCategoryDescription(category) {
    const categoryStyles = {
      html: "orange",
      css: "green",
      javascript: "blue",
      accessibility: "purple",
    };

    let title = category;
    if (title === "accessibility" || title === "javascript") {
      title = title.charAt(0).toUpperCase() + title.slice(1);
    } else {
      title = title.toUpperCase();
    }

    const categoryObj = {
      title: title,
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
    return categoryContainer;
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
