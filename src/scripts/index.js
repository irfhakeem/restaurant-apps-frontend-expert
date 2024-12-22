import "regenerator-runtime"; /* for async await transpile */
import "../styles/main.css";
import "../styles/detail.css";

import App from "./views/app";

document.addEventListener("DOMContentLoaded", () => {
  const app = new App({
    mainContent: document.querySelector("#mainContent"),
  });

  app.renderPage();

  window.addEventListener("hashchange", () => {
    app.renderPage();
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const toggleButton = document.querySelector(".navbar-toggle");
  const menu = document.querySelector(".navbar-menu");
  const body = document.querySelector("body");

  toggleButton.addEventListener("click", function () {
    menu.classList.toggle("active");
  });

  document.addEventListener("click", function (e) {
    if (!menu.contains(e.target) && !toggleButton.contains(e.target)) {
      menu.classList.remove("active");
    }
  });
});

document.querySelector(".skip-link").addEventListener("click", function (e) {
  e.preventDefault();
  const mainContent = document.getElementById("mainContent");
  mainContent.focus();
});
