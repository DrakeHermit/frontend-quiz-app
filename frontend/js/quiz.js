import { QuizService } from "./quiz-service.js";
import { QuizStateManager } from "./QuizStateManager.js";
import CustomButton from "./components/CustomButton.js";
import ProgressBar from "./components/ProgressBar.js";
import LoadingState from "./components/LoadingState.js";

export class Quiz {
  constructor(stateManager) {
    this.stateManager = stateManager;
    this.progressBar = null;
    this.currentButton;

    this.stateManager.subscribe((state) => {
      if (state.showError) {
        this.addError();
      }

      if (state.questions.length > 0 && !this.progressBar) {
        const container = document.querySelector(".main__left");
        this.initializeProgressBar(container);
      }

      const buttons = document.querySelectorAll(".button__group");
      switch (state.phase) {
        case "answering":
          // Enable buttons before validation
          buttons.forEach((btn) => btn.disabled.false);
          this.displayQuestion();
          break;

        case "answered":
          const selectedBtn = buttons[state.selectedAnswer];
          const correctBtn = buttons[state.correctAnswerIndex];

          // Disable buttons after validation
          buttons.forEach((btn) => (btn.disabled = true));

          if (state.isCorrect) {
            this.showAnswer(true, selectedBtn);
          } else {
            this.showAnswer(false, selectedBtn);
            this.showCorrectAnswer(correctBtn);
          }
          break;

        case "completed":
          this.showResults();
          break;

        case "initial":
          this.progressBar = null;
          this.displayUI();
      }
    });

    this.selectedCategory;
    this.init();
  }

  init() {
    this.addEventListeners();
  }

  displayUI() {
    const mainUIComponent = document.querySelector(".main__content");
    mainUIComponent.innerHTML = `
      <div class="main__left">
            <h1 class="main__heading">
              Welcome to the <br />
              <span class="bold">Frontend Quiz!</span>
            </h1>
            <p id="remove">Pick a subject to get started.</p>
          </div>
      <div class="main__right">
        <div role="group" class="buttons" aria-label="Quiz Categories">
              <ul>
                <li>
                  <button class="button__group" data-category="html">
                    <div class="img-wrapper orange"><img src="/frontend/assets/images/icon-html.svg" alt=""></div>
                    <span>HTML</span>
                  </button>
                </li>
                <li>
                  <button class="button__group" data-category="css">
                    <div class="img-wrapper green"><img src="/frontend/assets/images/icon-css.svg" alt=""></div>
                    <span>CSS</span>
                  </button>
                </li>
                <li>
                  <button class="button__group" data-category="javascript">
                    <div class="img-wrapper blue"><img src="/frontend/assets/images/icon-javascript.svg" alt=""></div>
                    <span>Javascript</span>
                  </button>
                </li>
                <li>
                  <button class="button__group" data-category="accessibility">
                    <div class="img-wrapper purple"><img src="/frontend/assets/images/icon-accessibility.svg" alt=""></div>
                    <span>Accessibility</span>
                  </button>
                </li>
              </ul>
            </div>
      </div>
    `;

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
      <custom-button></custom-button>
    </div>
    `;

    const button = layout.querySelector("custom-button");
    button.stateManager = this.stateManager;
  }

  addSubmitButton() {
    const button = document.createElement("custom-button");
    button.stateManager = this.stateManager;
    return button;
  }

  initializeProgressBar(container) {
    this.progressBar = document.createElement("progress-bar");
    this.progressBar.stateManager = this.stateManager;
    container.appendChild(this.progressBar);
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
