import Database from '../../data/db';
import { ListOfRestaurants, RestaurantImage } from '../../data/api';
import loading from './loading';
import config from '../../globals/config';
import '../../../styles/favorite.css';
import '../../../styles/main.css';

const CACHE_NAME = config.CACHE_NAME;

async function fetchWithCache(requestKey, fetchFunction) {
  const cache = await caches.open(CACHE_NAME);
  try {
    const timeout = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Request timed out')), 2000)
    );

    const fetchData = fetchFunction();
    const data = await Promise.race([fetchData, timeout]);

    if (!data) throw Error;

    const responseToCache = new Response(JSON.stringify(data));
    await cache.put(requestKey, responseToCache);

    return data;
  } catch (error) {
    console.error('Error fetching data:', error);

    const cachedResponse = await cache.match(requestKey);
    if (cachedResponse) return cachedResponse.json();

    console.error('No data available');
  }
}

async function fetchFavorites() {
  return await Database.getAllFavorites();
}

async function fetchRestaurants() {
  return await fetchWithCache('listOfRestaurants', ListOfRestaurants);
}

async function restaurantPictures(pictureId) {
  return await fetchWithCache(`restaurantPicture-${pictureId}`, () =>
    RestaurantImage({ pictureId })
  );
}

export default async () => {
  const contentContainer = document.getElementById('mainContent');
  if (contentContainer) contentContainer.innerHTML = loading();

  const favorites = await fetchFavorites();
  console.log(favorites);

  let restaurants = await fetchRestaurants();
  restaurants = restaurants.filter((restaurant) =>
    favorites.includes(restaurant.id)
  );
  restaurants = await Promise.all(
    restaurants.map(async (restaurant) => ({
      ...restaurant,
      pictureId: await restaurantPictures(restaurant.pictureId),
    }))
  );

  const template = `
    <div class="favorite-main">
        <h1>Your Favorite Restaurant</h1>
        <div class="favorite-restaurants">
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
    .join('')}
        </div>
    </div>`;

  return template;
};
