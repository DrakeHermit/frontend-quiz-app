class CustomButton extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  set stateManager(manager) {
    this._stateManager = manager;
    this.initialize();
  }

  get stateManager() {
    return this._stateManager;
  }

  initialize() {
    if (this._stateManager) {
      this._stateManager.subscribe((state) => {
        // Update button text based on phase
        switch (state.phase) {
          case "answering":
            this.updateButtonText("Submit Answer");
            break;
          case "answered":
            if (state.isLastQuestion) {
              this.updateButtonText("Finish Quiz");
            } else {
              this.updateButtonText("Next Question");
            }
            break;
        }
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

  updateButtonText(text) {
    const button = this.shadowRoot.querySelector("button");
    if (button) {
      button.textContent = text;
    }
  }

  handleBtnClick() {
    const button = this.shadowRoot.querySelector("button");
    button.addEventListener("click", () => {
      this._stateManager.handleButtonClick();
    });
  }
}

customElements.define("custom-button", CustomButton);

export default CustomButton;
