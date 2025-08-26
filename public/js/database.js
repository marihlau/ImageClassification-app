async function loadImages() {
  try {
    const res = await fetch('/uploads');
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
      `;
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
