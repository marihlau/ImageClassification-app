document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("authToken");
  const gallery = document.getElementById('gallery');
  const logoutBtn = document.getElementById("logoutBtn");
  const loginBtn = document.getElementById("toLogin");
  const userStatus = document.getElementById("userStatus");
  //const admin = JSON.parse(localStorage.getItem("isAdmin"));
  const admin = true;

//defining different functionality if admin/user/not logged in
  if (!token) {
        if (logoutBtn) logoutBtn.style.display = "none";  
        if (loginBtn) loginBtn.style.display = "inline-block"; 
        userStatus.innerText = "Not logged in";
        userStatus.style.color = "#2f4156";
    } else if (admin) {
        if (logoutBtn) logoutBtn.style.display = "inline-block"; 
        if (loginBtn) loginBtn.style.display = "none";
        userStatus.innerText = "Logged in as admin";
        userStatus.style.color = "#2f4156";
    } else {
        if (logoutBtn) logoutBtn.style.display = "inline-block"; 
        if (loginBtn) loginBtn.style.display = "none";
        userStatus.innerText = "Logged in as user";
        userStatus.style.color = "green";
        }
    
  async function loadImages() {

    //if not logged in, return to login page
    if (!token) {
      window.location.href = '/login.html';
      return;
    }
    try {
      const res = await fetch(`/uploads/`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.status === 401 || res.status === 403) {
        alert("Session expired, please login again.");
        localStorage.removeItem("authToken");
        window.location.href = "/login.html";
        return;
      }

      if (!res.ok) throw new Error('Failed to fetch images: ' + res.statusText);

      const images = await res.json();
      gallery.innerHTML = '';

      for (const img of images) {
        const card = document.createElement('div');
        card.className = 'card';

        // Fetch image with the token
        const response = await fetch(`/uploads/${img.id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const blob = await response.blob();
        const imgURL = URL.createObjectURL(blob);

        // Show delete button if admin
        card.innerHTML = `
          <img src="${imgURL}" >
          <h3>${img.name}</h3>
          <p>Label: ${img.label}</p>
          <p>Probability: ${(img.confidence * 100).toFixed(2)}%</p>
          ${admin ? `<button class="delete-btn" data-id="${img.id}">Delete</button>` : ''}
        `;

        gallery.appendChild(card);
      }
    } catch (err) {
      console.error(err);
      gallery.innerText = 'Failed to load images.';
    }
  }

  // delete button only available if admin
  if (admin) {
    gallery.addEventListener("click", async (e) => {
      if (!e.target.classList.contains("delete-btn")) return;

      const id = e.target.dataset.id;

      if (!confirm("Are you sure you want to delete this image?")) return;
        try{
            console.log("Auth token:", token, "deleting image with id:", id);
            const url = `/uploads/${id}`;
            console.log("Fetching URL:", url);
            const res = await fetch(url, { //deleting image with the id
              method: "DELETE",
              headers: { 'Authorization': `Bearer ${token}` }
            });
            console.log("Response received:", res.status);
            if (!res.ok) {
              let errMsg = "Unknown error";
              try{
                const data = await res.json();
                errMsg = data.error || JSON.stringify(data);
              } catch {
                try{
                  const text = await res.text();
                  errMsg = text;
                }catch{}
              }
              alert("Failed to delete image: " + errMsg);
              return;
            }

            alert("Image deleted successfully");
            await loadImages();

          } catch (err) {
            console.error("Failed to delete image: " + err);
            alert("Failed to delete image admin function");
          }
          });
      }

      loadImages();

  //navbar functionality
  document.getElementById("toLogin").addEventListener("click", () => { window.location.href = '/login.html'; });
  document.getElementById("toHome").addEventListener("click", () => { window.location.href = '/index.html'; });
  document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("isAdmin");
    userStatus.innerText = "Not logged in";
    userStatus.style.color = "red";
    logoutBtn.style.display = "none";
    loginBtn.style.display = "inline-block";
    window.location.href = '/index.html';
  });

});

