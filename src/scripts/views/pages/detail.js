import { DetailRestaurant, RestaurantImage, AddReview } from "../../api/api";

async function fetchRestaurant(id) {
  const restaurant = await DetailRestaurant({ id: id });
  return restaurant;
}

async function fetchImage(pictureId) {
  const imageUrl = await RestaurantImage({ pictureId });
  return imageUrl;
}

async function postReview(id, name, review) {
  const reviews = await AddReview({ id, name, review });
  return reviews;
}

export default async (id) => {
  let data = await fetchRestaurant(id);
  const imageUrl = await fetchImage(data.pictureId);

  const template = `
    <div class="detail-image">
      <img src="${imageUrl}" alt="${data.name}" />
    </div>

    <div class="detail-main">
      <div class="detail-header">
        <h1>${data.name}</h1>

        <div class="detail-info">
          <div class="detail-city">📍 ${data.city}</div>
          <div class="detail-rating">⭐️ ${data.rating}</div>
          <button id="like-button" aria-label="like this restaurant">🩷</button>
        </div>
      </div>

      <div class="detail-more">
        <div class="detail-description">
          <h2>Description</h2>
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

  setTimeout(() => {
    const form = document.getElementById("post-review-form");
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const name = document.getElementById("review-name").value;
      const review = document.getElementById("review-text").value;

      try {
        const result = await postReview(id, name, review);
        alert("Review berhasil ditambahkan");

        window.location.reload();
      } catch (error) {
        console.error("Error posting review:", error);
      }
    });
  }, 0);

  return template;
};
