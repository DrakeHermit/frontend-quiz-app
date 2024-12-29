class CustomButton extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.state = "submit";
  }

  connectedCallback() {
    this.render();

    this.handleBtnClick();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        button {
          width: 100%;
          padding: 25px;
          border-radius: 12px;
          background-color: #A729F5;
          border: none;
          cursor: pointer;
          color: #fff;
          font-size: 22px;
          font-weight: 700;
          transition: all 0.2s;
        }
        
        button:hover {
          background-color: #F6E7FF;
          color: #A729F5;
        }
        button:disabled {
          background-color: #ccc;
          cursor: not-allowed;
        }
      </style>

      <button>
        ${this.state === "submit" ? "Submit answer" : "Next Question"}
      </button>
    `;
  }

  updateButtonText() {
    const buttonText =
      this.state === "submit" ? "Submit answer" : "Next question";
    this.shadowRoot.querySelector("button").textContent = buttonText;
  }

  setState(newState) {
    console.log("Setting state to:", newState);
    this.state = newState;
    this.render();
    this.handleBtnClick();
  }

  handleBtnClick() {
    const button = this.shadowRoot.querySelector("button");
    button.addEventListener("click", () => {
      if (this.state === "submit") {
        this.handleClick();
      } else if (this.state === "next") {
        console.log(
          "Next state detected, nextQuestion exists?:",
          !!this.nextQuestion
        );
        if (this.nextQuestion) {
          this.nextQuestion();
        }
      }
    });
  }
}

customElements.define("custom-button", CustomButton);

export default CustomButton;
