export function setupDragAndFavorite(addFavoriteByKey, onFavoriteAdded) {
  const favoriteZone = document.getElementById("favoriteZone");
  if (!favoriteZone) return;

  favoriteZone.addEventListener("dragover", (e) => {
    e.preventDefault();
    favoriteZone.classList.add("hover");
  });

  favoriteZone.addEventListener("dragleave", () => {
    favoriteZone.classList.remove("hover");
  });

  favoriteZone.addEventListener("drop", async (e) => {
    e.preventDefault();
    favoriteZone.classList.remove("hover");

    const key = e.dataTransfer.getData("text/plain");
    if (!key) return;

    const success = await addFavoriteByKey(key);
    if (success) {
      await onFavoriteAdded();
    } else {
      alert("Kunde inte favoritmarkera meddelandet");
    }
  });
}
