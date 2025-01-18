class CustomButton extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  set stateManager(manager) {
    this._stateManager = manager;
    // Initialize the component now that we have the manager
    this.initialize();
  }

  get stateManager() {
    return this._stateManager;
  }

  initialize() {
    if (this._stateManager) {
      this._stateManager.subscribe((newState) => {
        this.updateButtonText(newState.buttonState);
      });
      this.render();
      this.handleBtnClick();
    }
  }

  render() {
    if (!this._stateManager) return;

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
        ${
          this._stateManager.state.buttonState === "submit"
            ? "Submit answer"
            : this._stateManager.state.buttonState === "finish"
            ? "Finish Quiz"
            : "Next question"
        }
      </button>
    `;
  }

  updateButtonText(buttonState) {
    const button = this.shadowRoot.querySelector("button");
    if (button) {
      const buttonText = {
        submit: "Submit answer",
        next: "Next question",
        finish: "Finish Quiz",
      }[buttonState];
      button.textContent = buttonText;
    }
  }

  handleBtnClick() {
    const button = this.shadowRoot.querySelector("button");
    button.addEventListener("click", () => {
      if (this._stateManager) {
        this._stateManager.handleButtonClick();
      }
    });
  }
}

customElements.define("custom-button", CustomButton);

export default CustomButton;
