        
const form = document.getElementById('loginForm');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const res = await fetch('/login', {
        method: 'POST',
        body: formData
    });

    if (res.ok) {
        window.location.href = '/index.html';
    } else if (res.status === 401) {
        alert('Unauthorized: Incorrect username or password');
    } else if (res.status === 404) {
        alert('User not found: Please create an account.');
    } else {
        const error = await res.text();
        alert(error);
    }
});

document.getElementById("toDatabase").addEventListener("click", () => {
    window.location.href = '/database.html';
});

document.getElementById("toHome").addEventListener("click", () => {
    window.location.href = '/index.html';
});