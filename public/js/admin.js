// Navigation buttons
document.getElementById("toSignUp").addEventListener("click", () => {
  window.location.href = "/signup.html";
});
document.getElementById("toDatabase").addEventListener("click", () => {
  window.location.href = "/database.html";
});
document.getElementById("toHome").addEventListener("click", () => {
  window.location.href = "/index.html";
});

document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("authToken");
  window.location.href = "/login.html";
});