import { ListOfRestaurants, RestaurantImage } from "../../api/api";

async function fetchRestaurants() {
  const response = await ListOfRestaurants();
  return response;
}

async function restaurantPictures(pictureId) {
  const response = await RestaurantImage({ pictureId });
  return response;
}

export default async () => {
  let restaurants = await fetchRestaurants();
  restaurants = await Promise.all(
    restaurants.map(async (restaurant) => ({
      ...restaurant,
      pictureId: await restaurantPictures(restaurant.pictureId),
    }))
  );

  return `
    <!-- Hero -->
    <div class="hero">
      <div class="hero-image">
        <img src="./images/heros/hero-image_4.jpg" alt="hero-image" />
      </div>
      <div class="hero-inner">
        <h1>Restaurant <span>Apps</span></h1>
        <p>
          Lorem ipsum, dolor sit amet consectetur adipisicing elit.
          Reprehenderit voluptatem a in aut magnam quos adipisci quo natus
          beatae blanditiis, veritatis, est tenetur? Quasi mollitia asperiores,
          sequi eius error obcaecati.
        </p>
      </div>
    </div>

    <!-- Content Container -->
      <div class="content">
        <h1>Explore Restaurants</h1>
        <div id="content-container">
        ${restaurants
          .map(
            (restaurant) => `
            <div class="card">
                <img src="${restaurant.pictureId}" alt="${restaurant.name}" class="card-image">
                <div class="card-info">
                    <p class="card-city">📍 ${restaurant.city}</p>
                    <p class="card-rating">⭐ ${restaurant.rating}</p>
                </div>
                <div class="card-content">
                    <a href="#/detail/${restaurant.id}" class="card-title">${restaurant.name}</a>
                    <p class="card-description">${restaurant.description}</p>
                </div>
            </div>
            `
          )
          .join("")}
        </div>
      </div>
    </main>`;
};
