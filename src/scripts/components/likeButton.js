import Database from '../data/db';
import '../../styles/detail.css';

async function isFavorite(id) {
  return Database.isFavorite(id);
}

async function addFavorite(id) {
  return Database.addFavorite(id);
}

async function deleteFavorite(id) {
  return Database.deleteFavorite(id);
}

export default async (id) => {
  let isFav = await isFavorite(id);

  const container = document.createElement('div');
  const likeButton = document.createElement('button');
  likeButton.id = 'like-button';
  likeButton.ariaLabel = isFav
    ? 'unlike this restaurant'
    : 'like this restaurant';
  likeButton.className = 'like';
  likeButton.innerHTML = `
      <i style="color:${
  isFav ? 'red' : 'white'
};" class="fa fa-heart" aria-hidden="true"></i>
    `;

  likeButton.addEventListener('click', async () => {
    if (isFav) {
      await deleteFavorite(id);
      isFav = false;
    } else {
      await addFavorite(id);
      isFav = true;
    }

    likeButton.ariaLabel = isFav
      ? 'unlike this restaurant'
      : 'like this restaurant';
    likeButton.querySelector('i').style.color = isFav ? 'red' : 'white';
  });

  container.appendChild(likeButton);
  return container;
};
