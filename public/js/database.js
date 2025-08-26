document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("authToken");
  
  async function loadImages() {
    
    if(!token){
      window.location.href = '/login.html';
      return
    }
    
    try {
      const res = await fetch('/uploads', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (res.status === 401 || res.status === 403) {
        alert("Session expired, please login again.");
        localStorage.removeItem("authToken");
        window.location.href = "/login.html";
        return;
      }
      
      if (!res.ok) throw new Error('Failed to fetch images');
      const images = await res.json();
      const gallery = document.getElementById('gallery');
      gallery.innerHTML = '';
      
      images.forEach(img => {
        const card = document.createElement('div');
        card.className = 'card';
        const imgURL = `/uploads/${img.id}`;
        
        card.innerHTML = `
        <img src="${imgURL}" alt="${img.name}">
        <h3>${img.name}</h3>
        <p>Label: ${img.label}</p>
        <p>Probability: ${(img.confidence * 100).toFixed(2)}%</p>
        ;
        <button class="delete-btn" data-id="${img.id}">Delete</button>`;
        gallery.appendChild(card);
      });
      
    } catch (err) {
      console.error(err);
      document.getElementById('gallery').innerText = 'Failed to load images.';
    }
  }
  
  loadImages();
  
  document.getElementById("toLogin").addEventListener("click", () => {
    window.location.href = '/login.html';
  });
  
  document.getElementById("toHome").addEventListener("click", () => {
    window.location.href = '/index.html';
  });

  document.getElementById("toDatabase").addEventListener("click", () => {
    window.location.href = '/database.html';
  });

  document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("authToken");
    window.location.href = '/login.html';
  });

});