import { auth } from "./firebaseInit.js";
import { onAuthStateChanged, signInWithPopup, signOut, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js";

export function setupAuth({ onAuthUserChange } = {}) {
  const loginBtn = document.getElementById("loginBtn");
  const logoutBtn = document.getElementById("logoutBtn");
  const logoutItem = document.getElementById("logoutItem");
  const usernameInput = document.getElementById("usernameInput");
  let previousUser;

  onAuthStateChanged(auth, (user) => {
    if (user) {
      window.currentUserId = user.uid;
      loginBtn.textContent = `Signed in as ${user.displayName || user.email}`;
      loginBtn.disabled = true;
      logoutItem.style.display = "";
      usernameInput.value = user.displayName || user.email;
      usernameInput.closest(".col-12.col-md-3").style.display = "none";
    } else {
      window.currentUserId = null;
      loginBtn.textContent = "Sign in with Google";
      loginBtn.disabled = false;
      logoutItem.style.display = "none";
      usernameInput.value = "";
      usernameInput.closest(".col-12.col-md-3").style.display = "";
    }

    const isInitial = typeof previousUser === "undefined";
    if (typeof onAuthUserChange === "function") {
      onAuthUserChange({ user, previousUser: previousUser || null, isInitial });
    }
    previousUser = user;
  });

  logoutBtn.addEventListener("click", () => {
    signOut(auth).catch((error) => console.error("Sign-out error:", error));
  });

  loginBtn.addEventListener("click", () => {
    signInWithPopup(auth, new GoogleAuthProvider())
      .then((result) => console.log("User signed in:", result.user))
      .catch((error) => {
        console.error("Error signing in:", error);
        if (error.code === "auth/unauthorized-domain") {
          alert(
            "Sign-in failed: this domain is not authorized in Firebase.\nOpen the app via a local server (e.g. Live Server) instead of opening the file directly.",
          );
        } else {
          alert(`Sign-in failed: ${error.message}`);
        }
      });
  });
}
