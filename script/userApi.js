const baseUrl = "https://flaskpost-8adcc-default-rtdb.europe-west1.firebasedatabase.app/users";

export async function getAllUsers() {
  const url = baseUrl + ".json";
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to fetch users: ${res.status} ${res.statusText}`);
    return await res.json();
  } catch (error) {
    console.error("Error fetching users:", error);
    return null;
  }
}

export async function postUser(user) {
  const url = baseUrl + ".json";
  try {
    const res = await fetch(url, {
      method: "POST",
      body: JSON.stringify(user),
      headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) throw new Error(`Failed to post user: ${res.status}`);
    return await res.json();
  } catch (error) {
    console.error("Error posting user:", error);
    return null;
  }
}

export async function deleteUser(userKey) {
  const url = `${baseUrl}/${userKey}.json`;
  try {
    const res = await fetch(url, { method: "DELETE" });
    if (!res.ok) throw new Error(`Failed to delete user: ${res.status}`);
    return true;
  } catch (error) {
    console.error("Error deleting user:", error);
    return false;
  }
}
