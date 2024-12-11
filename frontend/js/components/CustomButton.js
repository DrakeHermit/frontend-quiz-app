class CustomButton extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
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
      </style>

      <button>Submit Answer</button>
    `;

    this.shadowRoot
      .querySelector("button")
      .addEventListener("click", () => console.log("It works"));
  }
}

customElements.define("custom-button", CustomButton);

export default CustomButton;
