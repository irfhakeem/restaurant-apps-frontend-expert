const config = {
  baseUrl: "https://restaurant-api.dicoding.dev",
  listOfRestaurants: "/list",
  detailRestaurant: "/detail/",
  reviewRestaurant: "/review",
  searchRestaurant: "/search?q=",
  restaurantImage: "/images/medium/",
};

export async function ListOfRestaurants() {
  try {
    const response = await fetch(
      `${config.baseUrl}${config.listOfRestaurants}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const responseJson = await response.json();
    return responseJson.restaurants;
  } catch (error) {
    console.error("Error:", error);
  }
}

export async function DetailRestaurant(request) {
  try {
    const response = await fetch(
      `${config.baseUrl}${config.detailRestaurant}${request.id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const responseJson = await response.json();
    return responseJson.restaurant;
  } catch (error) {
    console.error("Error:", error);
  }
}

export async function SearchRestaurant(request) {
  try {
    const response = await fetch(
      `${config.baseUrl}${config.searchRestaurant}${request.query}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const responseJson = await response.json();
    return responseJson.restaurants;
  } catch (error) {
    console.error("Error:", error);
  }
}

export async function AddReview(request) {
  try {
    const response = await fetch(
      `${config.baseUrl}${config.reviewRestaurant}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: request.id,
          name: request.name,
          review: request.review,
        }),
      }
    );
    const responseJson = await response.json();
    return responseJson.customerReviews;
  } catch (error) {
    console.error("Error:", error);
  }
}

export async function RestaurantImage(request) {
  try {
    const response = await fetch(
      `${config.baseUrl}${config.restaurantImage}${request.pictureId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.url;
  } catch (error) {
    console.error("Error:", error);
  }
}
