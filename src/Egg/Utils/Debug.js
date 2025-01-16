import { Pane } from "tweakpane";

export default class Debug {
  constructor() {
    if (window.gui) {
      this.gui = window.gui;
    } else {
      this.gui = new Pane({
        title: "Parameters",
      });

      window.gui = this.gui;
    }
  }
}
