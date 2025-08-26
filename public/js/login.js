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
