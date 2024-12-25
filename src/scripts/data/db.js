import { openDB } from 'idb';
import config from '../globals/config';

const DATABASE_NAME = config.DATABASE_NAME;
const DATABASE_VERSION = config.DATABASE_VERSION;
const OBJECT_STORE_NAME = config.OBJECT_STORE_NAME;

const dbPromise = openDB(DATABASE_NAME, DATABASE_VERSION, {
  upgrade(database) {
    if (!database.objectStoreNames.contains(OBJECT_STORE_NAME)) {
      database.createObjectStore(OBJECT_STORE_NAME, { keyPath: 'id' });
    }
  },
});

const Database = {
  async getFavorite(id) {
    if (!id) throw new Error('ID is required');
    return (await dbPromise).get(OBJECT_STORE_NAME, id);
  },

  async getAllFavorites() {
    const favorites = await (await dbPromise).getAllKeys(OBJECT_STORE_NAME);
    return favorites;
  },

  async addFavorite(id) {
    if (!id) throw new Error('ID is required');
    return (await dbPromise).put(OBJECT_STORE_NAME, { id });
  },

  async deleteFavorite(id) {
    if (!id) throw new Error('ID is required');
    return (await dbPromise).delete(OBJECT_STORE_NAME, id);
  },

  async isFavorite(id) {
    const favorite = await this.getFavorite(id);
    return !!favorite;
  },
};

export default Database;
