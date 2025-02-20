export default class ProgressBar extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.currentWidth = 0;
    this.createBaseStructure(); // Create DOM once
  }

  createBaseStructure() {
    this.shadowRoot.innerHTML = `
      <style>
        .container {
          margin: 2rem 0 3rem 0;
          width: 100%;
          height: 12px;
          background-color: var(--clr-light, #3B4D66);
          border-radius: 8px;
          padding: 2px 4px;
          display: flex;
          align-items: center;
        }

        .progress-fill {
          height: 8px;
          background-color: var(--purple-color, #A729F5);
          border-radius: 4px;
          width: 10%;
          will-change: width;
          transition: width 400ms cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        @media(min-width: 640px) {
          .container {
            margin: 2.5rem 0 4rem 0;
          }
        
        @media(min-width: 1080px) {
          .container {
            margin-top: 4rem;
          }
        }
      </style>

      <div class="container">
        <div class="progress-fill"></div>
      </div>
    `;
  }

  connectedCallback() {
    // Add transition class after a brief delay
    requestAnimationFrame(() => {
      const fill = this.shadowRoot.querySelector(".progress-fill");
      if (fill) {
        fill.classList.add("can-transition");
      }
    });
  }

  disconnectedCallback() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
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
      this.unsubscribe = this._stateManager.subscribe((newState) => {
        if (newState.questions.length > 0) {
          this.updateProgress(
            newState.currentQuestionIndex + 1,
            newState.questions.length
          );
        }
      });
    }
  }

  updateProgress(current, total) {
    const fill = this.shadowRoot.querySelector(".progress-fill");
    if (fill) {
      const progress = (current / total) * 100;
      if (fill.style.width !== `${progress}%`) {
        fill.style.width = `${progress}%`;
      }
    }
  }
}

customElements.define("progress-bar", ProgressBar);
