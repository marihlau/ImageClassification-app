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
    localStorage.setItem("authToken", data.authToken); //storing auth token
    localStorage.setItem("isAdmin", JSON.stringify(data.admin)); //storing if user is admin

    if (!res.ok) throw new Error(data.error || "Signup failed");

    alert("✅ " + data.message);
    window.location.href = "/login.html"; //going to login page after signup
  } catch (err) {
    alert("❌ " + err.message);
  }
});

//navbar buttons functionality
document.getElementById("toDatabase").addEventListener("click", () => {
    window.location.href = '/database.html';
});

document.getElementById("toHome").addEventListener("click", () => {
    window.location.href = '/index.html';
});

document.getElementById("toLogin").addEventListener("click", () => {
    window.location.href = '/login.html';
});

