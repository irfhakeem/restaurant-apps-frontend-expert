import { DetailRestaurant, RestaurantImage, AddReview } from "../../data/api";
import likeButton from "../../components/likeButton";
import loading from "./loading";
import config from "../../globals/config";

const CACHE_NAME = config.CACHE_NAME;

async function fetchWithCache(requestKey, fetchFunction) {
  const cache = await caches.open(CACHE_NAME);
  try {
    const timeout = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Request timed out")), 5000)
    );

    const fetchData = fetchFunction();
    const data = await Promise.race([fetchData, timeout]);

    if (!data) throw new Error("No Internet Connection");

    const responseToCache = new Response(JSON.stringify(data));
    await cache.put(requestKey, responseToCache);

    return data;
  } catch (error) {
    console.error("Error fetching data:", error);

    const cachedResponse = await cache.match(requestKey);
    if (cachedResponse) return cachedResponse.json();

    console.error("No data available");
  }
}

async function fetchRestaurant(id) {
  return await fetchWithCache(`detailOfRestaurant-${id}`, () =>
    DetailRestaurant({ id: id })
  );
}

async function restaurantPicture(pictureId) {
  return await fetchWithCache(`restaurantPicture-${pictureId}`, () =>
    RestaurantImage({ pictureId: pictureId })
  );
}

async function postReview(id, name, review) {
  const reviews = await AddReview({ id, name, review });
  return reviews;
}

export default async (id) => {
  const contentContainer = document.getElementById("mainContent");
  if (contentContainer) contentContainer.innerHTML = loading();

  let data = await fetchRestaurant(id);
  data = {
    ...data,
    pictureId: await restaurantPicture(data.pictureId),
  };

  const template = `
    <div class="detail-image">
      <img src="${data.pictureId}" alt="${data.name}" />
    </div>

    <div class="detail-main">
      <div class="detail-header">
        <h1>${data.name}</h1>

        <div class="detail-info">
          <div class="detail-city">📍 ${data.city}</div>
          <div class="detail-rating">⭐️ ${data.rating}</div>
          <div id="like-button-container">
          </div>
        </div>
      </div>

      <div class="detail-more">
        <div class="detail-description">
          <h2>Description</h2>
          <p style="margin-bottom:10px">Address: ${data.address}</p>
        <p>${data.description}</p>
        </div>
        <div class="detail-menu">
          <h2>Menu</h2>
          <div class="detail-menu-list">
            <div class="detail-menu-item">
              <h3>Foods</h3>
              <ul>
                ${data.menus.foods
                  .map((food) => `<li>${food.name}</li>`)
                  .join("")}
              </ul>
            </div>
            <div class="detail-menu-item">
              <h3>Drinks</h3>
              <ul>
                ${data.menus.drinks
                  .map((drink) => `<li>${drink.name}</li>`)
                  .join("")}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div class="detail-review">
      <div class="detail-post-review">
        <h2>Review (${data.customerReviews.length})</h2>
          <h3>Post Review</h3>
          <form id="post-review-form">
            <div class="form-control">
              <label for="name">Name</label>
              <input type="text" id="review-name" name="name" required />
            </div>
            <div class="form-control">
              <label for="review">Review</label>
              <textarea id="review-text" name="review" maxlength="500" required></textarea>
            </div>
            <button type="submit">Submit</button>
          </form>
        </div>

        <div class="detail-other-reviews">
          ${data.customerReviews
            .map(
              (review) => `
                <div class="review">
                  <div class="review-header">
                    <div class="review-name">👤 ${review.name}</div>
                    <div class="review-date">${review.date}</div>
                  </div>
                  <p>${review.review}</p>
                </div>
              `
            )
            .join("")}
        </div>
      </div>
    </div>
  `;

  contentContainer.innerHTML = template;

  setTimeout(async () => {
    const likeButtonContainer = document.getElementById(
      "like-button-container"
    );
    if (likeButtonContainer) {
      const likeButtonElement = await likeButton(id);
      likeButtonContainer.appendChild(likeButtonElement);
    }
  }, 0);

  const form = document.getElementById("post-review-form");
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const name = document.getElementById("review-name").value;
      const review = document.getElementById("review-text").value;

      try {
        const response = await postReview(id, name, review);
        if (response) alert("Review berhasil ditambahkan");
        else throw new Error();
      } catch (error) {
        console.error("Error posting review:", error);
        alert("Gagal menambahkan review");
      }
    });
  } else console.log("form not found");

  return template;
};
