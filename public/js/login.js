const form = document.getElementById("loginForm");
const token = localStorage.getItem("authToken"); 
const userStatus = document.getElementById("userStatus");
const admin = JSON.parse(localStorage.getItem("isAdmin")); 
const logoutBtn = document.getElementById("logoutBtn");
const loginBtn = document.getElementById("toLogin");

if (!token) {
  if (logoutBtn) logoutBtn.style.display = "none"; 
  if (loginBtn) loginBtn.style.display = "inline-block"; 
  userStatus.innerText = "Not logged in";
  userStatus.style.color = "red";
} else if (admin) {
  if (logoutBtn) logoutBtn.style.display = "inline-block"; 
  if (loginBtn) loginBtn.style.display = "none";
  userStatus.innerText = "Logged in as admin";
  userStatus.style.color = "blue";
} else {
  if (logoutBtn) logoutBtn.style.display = "inline-block"; 
  if (loginBtn) loginBtn.style.display = "none";
  userStatus.innerText = "Logged in as user";
  userStatus.style.color = "green";
}

form.addEventListener("submit", async (e) => {
  e.preventDefault(); 
  const formData = new FormData(form);

  const user = {
    username: formData.get("username"),
    password: formData.get("password"),
  };

  try {
    const res = await fetch("/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });

    if (!res.ok) {
      const err = await res.json();
      alert("Login failed: " + err.error);
      return;
    }
    const data = await res.json();
    console.log("Login successful:", data);
    localStorage.setItem("authToken", data.authToken);
    localStorage.setItem("isAdmin", JSON.stringify(data.admin));
    
    alert("✅ Login successful!");
    window.location.href = "/index.html";

  } catch (err) {
    alert("❌ " + err.message);
  }
});

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
  localStorage.removeItem("isAdmin");
  userStatus.innerText = "Not logged in";
  userStatus.style.color = "red";
  logoutBtn.style.display = "none";
  loginBtn.style.display = "inline-block";
});
