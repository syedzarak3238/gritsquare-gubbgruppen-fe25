import {
  addFavoriteByUserId,
  getFavoritesByUserId,
  removeFavoriteByUserId,
} from "./userApi.js";

const GUEST_FAVORITES_KEY = "gubbChat_guestFavorites";

function readGuestFavoritesArray() {
  try {
    const parsed = JSON.parse(localStorage.getItem(GUEST_FAVORITES_KEY) || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeGuestFavoritesArray(values) {
  localStorage.setItem(GUEST_FAVORITES_KEY, JSON.stringify(values));
}

export function getGuestFavoritesSet() {
  return new Set(readGuestFavoritesArray());
}

export function hasGuestFavorites() {
  return readGuestFavoritesArray().length > 0;
}

export function clearGuestFavorites() {
  localStorage.removeItem(GUEST_FAVORITES_KEY);
}

export async function getFavoritesForCurrentUser(userId) {
  if (!userId) return getGuestFavoritesSet();

  const favoritesObj = await getFavoritesByUserId(userId);
  return new Set(Object.keys(favoritesObj || {}));
}

export async function addFavoriteForCurrentUser(messageKey, userId) {
  if (!messageKey) return false;

  if (!userId) {
    const set = getGuestFavoritesSet();
    set.add(messageKey);
    writeGuestFavoritesArray([...set]);
    return true;
  }

  return addFavoriteByUserId(userId, messageKey);
}

export async function removeFavoriteForCurrentUser(messageKey, userId) {
  if (!messageKey) return false;

  if (!userId) {
    const set = getGuestFavoritesSet();
    if (!set.has(messageKey)) return true;
    set.delete(messageKey);
    writeGuestFavoritesArray([...set]);
    return true;
  }

  return removeFavoriteByUserId(userId, messageKey);
}

export async function toggleFavoriteForCurrentUser(messageKey, userId) {
  if (!messageKey) return false;

  if (!userId) {
    const set = getGuestFavoritesSet();
    if (set.has(messageKey)) {
      set.delete(messageKey);
    } else {
      set.add(messageKey);
    }
    writeGuestFavoritesArray([...set]);
    return true;
  }

  const currentSet = await getFavoritesForCurrentUser(userId);
  if (currentSet.has(messageKey)) {
    return removeFavoriteByUserId(userId, messageKey);
  }

  return addFavoriteByUserId(userId, messageKey);
}

export async function migrateGuestFavoritesToUser(userId) {
  if (!userId) return false;

  const favorites = readGuestFavoritesArray();
  if (!favorites.length) return true;

  const results = await Promise.all(favorites.map((messageKey) => addFavoriteByUserId(userId, messageKey)));
  const allSucceeded = results.every(Boolean);

  if (allSucceeded) {
    clearGuestFavorites();
  }

  return allSucceeded;
}
