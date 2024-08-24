class Controls {
  constructor() {
    this.up = this.down = this.left = this.right = this.handbrake = false;

    this.#addKeyboardListeners();
  }

  #addKeyboardListeners() {
    document.addEventListener("keydown", (event) => {
      this.#setControls(event);
    });
    document.addEventListener("keyup", (event) => {
      this.#setControls(event, false);
    });
  }

  #setControls(event, value = true) {
    switch (event.key) {
      case "ArrowUp":
        this.up = value;
        break;
      case "ArrowDown":
        this.down = value;
        break;
      case "ArrowLeft":
        this.left = value;
        break;
      case "ArrowRight":
        this.right = value;
        break;
      case " ":
        this.handbrake = value;
        break;
    }
  }
}
