class ProgressBar extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
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
          transition: width 0.4s ease-in;
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

  updateProgress(current, total) {
    const progress = (current / total) * 100;
    this.shadowRoot.querySelector(
      ".progress-fill"
    ).style.width = `${progress}%`;
  }
}

customElements.define("progress-bar", ProgressBar);

export default ProgressBar;
