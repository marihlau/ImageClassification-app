const form = document.getElementById("loginForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault(); // stop normal form submission
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

    const data = await res.json();
    localStorage.setItem("authToken", data.authToken);

    if (data.admin) {
        window.location.href = "/admin.html";
    } else {
        window.location.href = "/index.html";
    }

    if (!res.ok) throw new Error(data.error || "Login failed");

    // Store JWT token
    localStorage.setItem("authToken", data.authToken);

    alert("✅ Login successful!");
    if (data.admin) {
        window.location.href = "/admin.html";
    } else {
        window.location.href = "/index.html";
    }

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
  window.location.href = "/login.html";
});
