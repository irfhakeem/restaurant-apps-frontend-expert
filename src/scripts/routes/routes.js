import HomePage from "../views/pages/home.js";
import DetailPage from "../views/pages/detail.js";

export const page = {
  "/": HomePage,
  "/detail": (id) => DetailPage(id),
  "/404": () => "<div><h1>Page Not Found</h1></div>",
};
