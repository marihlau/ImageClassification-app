const form = document.getElementById("signUpForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(form);

  const user = {
    username: formData.get("username"),
    password: formData.get("password"),
  };

  try {
    const res = await fetch("/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });

    const data = await res.json();
    console.log("Signup successful:", data);
    localStorage.setItem("authToken", data.authToken);
    localStorage.setItem("isAdmin", JSON.stringify(data.admin));

    if (!res.ok) throw new Error(data.error || "Signup failed");

    alert("✅ " + data.message);
    window.location.href = "/index.html"; //go to home page after sign up
  } catch (err) {
    alert("❌ " + err.message);
  }
});

document.getElementById("toDatabase").addEventListener("click", () => {
    window.location.href = '/database.html';
});

document.getElementById("toHome").addEventListener("click", () => {
    window.location.href = '/index.html';
});

document.getElementById("toLogin").addEventListener("click", () => {
    window.location.href = '/login.html';
});

