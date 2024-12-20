import "regenerator-runtime"; /* for async await transpile */
import "../styles/main.css";

console.log("Hello Coders! :)");

fetch("data/DATA.json")
  .then((response) => response.json())
  .then((data) => {
    const restaurants = data.restaurants;
    document.getElementById("content-container").innerHTML = restaurants
      .map(
        (item) => `
      <div class="card">
        <img src="${item.pictureId}" alt="${item.name}" class="card-image">
        <div class="card-info">
            <p class="card-city">📍 ${item.city}</p>
            <p class="card-rating">⭐ ${item.rating}</p>
        </div>
        <div class="card-content">
            <a href="#" class="card-title">${item.name}</a>
            <p class="card-description">${item.description}</p>
        </div>
      </div>
    `
      )
      .join("");
  })
  .catch((error) => {
    console.error("Error:", error);
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
