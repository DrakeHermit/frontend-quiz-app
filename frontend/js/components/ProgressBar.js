class ProgressBar extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.shadowRoot.innerHTML = `
      <style>
        .container {
          margin-top: 5rem;
          width: 100%;
          height: 12px;
          background-color: #3B4D66;
          border-radius: 8px;
          padding: 2px 4px;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .progress {
          height: 8px;
          width: 100%;
          background-color: #A729F5;
          border-radius: 4px;
        }
      </style>

      <div class="container">
        <div class="progress"></div>
      </div>
    `;
  }
}

customElements.define("progress-bar", ProgressBar);

export default ProgressBar;
