
document.getElementById("toLogin").addEventListener("click", () => {
  window.location.href = "/login.html";
});

document.getElementById("toHome").addEventListener("click", () => {
  window.location.href = "/index.html";
});

document.getElementById("toDatabase").addEventListener("click", () => {
  window.location.href = "/database.html";
});

document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("authToken");
  window.location.href = "/login.html";
});

document.getElementById("toAdmin").addEventListener("click", () => {
  window.location.href = "/admin.html";
});