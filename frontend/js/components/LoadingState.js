class LoadingState extends HTMLElement {
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

  connectedCallback() {
    this.render();
  }

  disconnectedCallback() {
    if (this._stateManager && this.unsubscribe) {
      this.unsubscribe();
    }
  }

  initialize() {
    if (this._stateManager) {
      this.unsubscribe = this._stateManager.subscribe((state) => {
        const loader = this.shadowRoot.querySelector(".loader");
        if (loader) {
          loader.style.display = state.isLoading ? "flex" : "none";
        }
      });
    }
  }
  render() {
    if (!this._stateManager) return;

    this.shadowRoot.innerHTML = `
        <style>
          .loader {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
            height: 25rem;
            background: inherit;
          }

          .loader::after {
            content: '';
            width: 100px;
            height: 100px;
            border: 15px solid #ddf8e9;
            border-top-color: #A729F5;
            border-radius: 50%;
            animation: loading 0.90s infinite linear;
          }

          @keyframes loading {
            from {
              transform: rotate(0turn);
            }
            to {
              transform: rotate(1turn);
            }
          }
        </style>

        <div class="loader"></div>
      `;
  }
}

customElements.define("loading-spinner", LoadingState);

export default LoadingState;
