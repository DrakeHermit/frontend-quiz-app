class LoadingState extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.shadowRoot.innerHTML = `
        <style>
          .loader {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
            height: 100px;
            background: inherit;
          }

          .loader::after {
            content: '';
            width: 100px;
            height: 100px;
            border: 15px solid #dddddd;
            border-top-color: #009578;
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
