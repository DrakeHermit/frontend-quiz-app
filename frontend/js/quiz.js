import { QuizService } from "./quiz-service.js";
import CustomButton from "./components/CustomButton.js";
import ProgressBar from "./components/ProgressBar.js";

export class Quiz {
  constructor() {
    this.service = new QuizService();
    this.currentQuestionIndex = 0;
    this.questions = [];
    this.score = 0;
    this.progressBar = null;
    this.currentButton;
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
    const selectedBtn = this.onValidate();
    if (selectedBtn) {
      this.validateAnswer();
    } else {
      this.addError();
    }
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

  onValidate() {
    let answerText;
    const questionAnswer = this.questions[
      this.currentQuestionIndex
    ].answer.trim();
    const selectedBtn = this.handleQuestionSubmit();
    if (selectedBtn) {
      answerText = selectedBtn.textContent.split(/[A-D]/)[1].trim();
    } else return;
    const isAnswered = answerText === questionAnswer ? true : false;
    this.showAnswer(isAnswered, selectedBtn);
    return selectedBtn;
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
      this.score++;
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

  async handleCategoryClick(e) {
    this.selectedCategory = e.currentTarget.dataset.category;
    this.questions = await this.service.fetchQuestions(this.selectedCategory);
    this.removeEventListeners();
    this.addCategoryDescription(this.selectedCategory);
    this.displayQuestion();
  }

  handleQuestionSubmit() {
    const buttons = document.querySelectorAll(".button__group");
    let selectedBtn;
    buttons.forEach((button) => {
      if (button.classList.contains("isSelected")) {
        selectedBtn = button;
      }
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
    }
  }

  handleNextQuestion() {
    if (this.currentQuestionIndex === this.questions.length - 2) {
      this.currentButton.setIsLastQuestion(true);
    }

    this.currentQuestionIndex++;
    if (this.currentQuestionIndex < this.questions.length) {
      this.displayQuestion();
    } else {
      this.showResults();
    }
  }

  showResults() {
    const category = this.addCategoryDescription(this.selectedCategory);
    document.querySelector(".main__content").innerHTML = `
    <div class="main__left">
      <h2>Quiz Completed</h2>
      <h3>You scored...</h3>
    </div>
    <div class="main__right">
      <div class="score__box">
        ${category.innerHTML}
        <div class="score">${this.score}</div>
        <div class="total__score">out of ${this.questions.length}</div>
      </div>
    </div>
    `;
  }

  addSubmitButton() {
    const button = document.createElement("custom-button");
    button.setState("submit");
    button.handleClick = this.handleAnswer.bind(this);
    button.nextQuestion = this.handleNextQuestion.bind(this);
    button.finishQuiz = this.showResults.bind(this);
    return button;
  }

  validateAnswer() {
    if (this.currentButton) {
      this.currentButton.setState(
        "next",
        this.currentQuestionIndex === this.questions.length - 1
      );
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
