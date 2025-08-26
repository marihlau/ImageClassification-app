document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("authToken");
  const userStatus = document.getElementById("userStatus");
  const toLogin = document.getElementById("toLogin");
  const toHome = document.getElementById("toHome");
  const toDatabase = document.getElementById("toDatabase");
  const logoutBtn = document.getElementById("logoutBtn");

  // Update user status
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      userStatus.innerText = `✅ Logged in as ${payload.username}`;
      toLogin.style.display = "none";   // hide login button
      logoutBtn.style.display = "inline-block";
    } catch {
      userStatus.innerText = "❌ Invalid token";
      logoutBtn.style.display = "none";
    }
  } else {
    userStatus.innerText = "❌ Not logged in";
    logoutBtn.style.display = "none";  // hide logout button
  }

  // Navigation button actions
  toLogin.addEventListener("click", () => window.location.href = "/login.html");
  toHome.addEventListener("click", () => window.location.href = "/index.html");
  toDatabase.addEventListener("click", () => window.location.href = "/database.html");
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("authToken");
    window.location.reload(); // refresh to update status
  });
});
