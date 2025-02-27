import { QuizService } from "./quiz-service.js";
import { QuizStateManager } from "./QuizStateManager.js";
import CustomButton from "./components/CustomButton.js";
import LoadingState from "./components/LoadingState.js";

export class Quiz {
  constructor(stateManager) {
    this.stateManager = stateManager;
    this.currentButton;
    this.currentProgress = 0;

    this.stateManager.subscribe((state) => {
      const buttons = document.querySelectorAll(".button__group");
      switch (state.phase) {
        case "answering":
          if (state.showError) {
            this.addError();
            return;
          }

          if (state.isLoading) {
            console.log("Loading the spinner");
            const container = document.querySelector(".main__content");
            this.initializeLoadingState(container);
            return; // Don't process anything else while loading
          }

          this.displayQuestion();

          this.updateProgress(
            state.currentQuestionIndex + 1,
            state.questions.length
          );

          // Enable buttons before validation
          buttons.forEach((btn) => btn.disabled.false);
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
          this.currentProgress = 0;
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

    const div = document.createElement("div");
    div.classList.add("error__field");

    const img = document.createElement("img");
    img.className = "error-mark";
    img.src = "/frontend/assets/images/icon-incorrect.svg";

    const span = document.createElement("span");
    span.className = "error";
    span.textContent = "Please select an answer";

    div.appendChild(img);
    div.appendChild(span);
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
    const ANSWER_LETTERS = ["A", "B", "C", "D"];

    if (
      currentState.currentQuestionIndex <=
      currentState.questions.length - 1
    ) {
      // Create main containers
      const mainLeft = document.createElement("div");
      mainLeft.className = "main__left";

      const mainRight = document.createElement("div");
      mainRight.className = "main__right";

      // Create and set up question title
      const title = document.createElement("h1");
      title.className = "main__heading";
      title.textContent = currentQuestion.question;
      title.style.fontSize = "36px";
      mainLeft.appendChild(title);

      // Create buttons container
      const buttonsContainer = document.createElement("div");
      buttonsContainer.className = "buttons";
      buttonsContainer.setAttribute("role", "group");
      buttonsContainer.setAttribute("aria-label", "Quiz Questions");

      // Create answer list
      const answersList = document.createElement("ul");

      // Create answer buttons
      currentQuestion.options.forEach((option, index) => {
        const listItem = document.createElement("li");

        const button = document.createElement("button");
        button.className = "button__group";
        button.dataset.answer = index;

        // Create letter wrapper
        const letterWrapper = document.createElement("div");
        letterWrapper.className = "img-wrapper bold-big";
        letterWrapper.textContent = ANSWER_LETTERS[index];

        // Create option text
        const optionText = document.createElement("span");
        optionText.textContent = option;

        // Assemble button
        button.appendChild(letterWrapper);
        button.appendChild(optionText);
        listItem.appendChild(button);
        answersList.appendChild(listItem);
      });

      // Add answers to buttons container
      buttonsContainer.appendChild(answersList);

      // Add submit button
      const submitBtn = this.addSubmitButton();
      buttonsContainer.appendChild(submitBtn);

      // Add buttons to right section
      mainRight.appendChild(buttonsContainer);

      // Add numerical progress to left section
      this.addNumericalProgress(mainLeft, currentState.currentQuestionIndex);

      // Create main content structure
      const mainContent = document.querySelector(".main__content");
      mainContent.innerHTML = ""; // Clear everything
      mainContent.appendChild(mainLeft);
      mainContent.appendChild(mainRight);

      this.initializeProgressBar(mainLeft);
      // Set up event listeners
      this.setupAnswerButtons();
    }
  }

  createHeadingElement() {
    const heading = document.createElement("h1");
    heading.classList.add("main__heading");
    return heading;
  }

  createContainerElement(className) {
    const container = document.createElement("div");
    container.classList.add(className);
    return container;
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
    // Create progress bar
    const progressBarContainer = document.createElement("div");
    progressBarContainer.classList.add("container");
    // Create progress fill
    const progressFill = document.createElement("div");
    progressFill.classList.add("progress-fill");

    progressFill.style.width = `${this.currentProgress}%`;

    progressBarContainer.appendChild(progressFill);
    container.appendChild(progressBarContainer);
  }

  updateProgress(current, total) {
    const fill = document.querySelector(".container .progress-fill");
    if (fill) {
      requestAnimationFrame(() => {
        this.currentProgress = (current / total) * 100;
        fill.style.width = `${this.currentProgress}%`;
      });
    }
  }

  initializeLoadingState(container) {
    console.log("Container before clearing:", container.innerHTML);
    container.innerHTML = "";
    console.log("Container after clearing:", container.innerHTML);

    console.log("Creating spinner");
    this.loadingSpinner = document.createElement("loading-spinner");
    this.loadingSpinner.stateManager = this.stateManager;
    console.log("Spinner created:", this.loadingSpinner);

    console.log("Trying to append spinner");
    container.appendChild(this.loadingSpinner);
    console.log("Container after append:", container.innerHTML);
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
