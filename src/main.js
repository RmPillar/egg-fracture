import "./style.css";

import Experience from "./Voronoi/Experience";

const canvas = document.querySelector("#app");

if (canvas) {
  new Experience(canvas);
}
