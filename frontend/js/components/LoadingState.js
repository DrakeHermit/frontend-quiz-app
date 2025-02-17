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

  render() {
    if (!this._stateManager) return;

    this.shadowRoot.innerHTML = `
      <style></style>

      <div></div>
    `;
  }
}
