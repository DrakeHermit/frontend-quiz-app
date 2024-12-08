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
          border-radius: 5px;
          position: relative;
          padding: 2px;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .progress {
          position: absolute;
          height: 8px;
          width: 10%;
          left: 4px;
          right: -4px;
          background-color: #A729F5;
          border-radius: 5px;
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
