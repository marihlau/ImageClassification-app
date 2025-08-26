const form = document.getElementById('signUpForm');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const res = await fetch('/signup', {
        method: 'POST',
        body: formData
    });

    if (res.ok) {
        window.location.href = '/index.html';
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

document.getElementById("toLogin").addEventListener("click", () => {
    window.location.href = '/login.html';
});