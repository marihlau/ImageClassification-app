//const { use } = require("react");

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById('imageUpload');
  const message = document.getElementById('message');
  const token = localStorage.getItem("authToken"); // get the JWT from login
  const userStatus = document.getElementById("userStatus");
  if (!token) {
    userStatus.innerText = "Not logged in";
    userStatus.style.color = "red";
} else {
    userStatus.innerText = "Logged in";
    userStatus.style.color = "green";
}

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = new FormData(form);

    if (!token) {
        alert("You must be logged in to upload files.");
        window.location.href = "/login.html";
        return;
    } 

    try {
        const res = await fetch('/uploads', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: data
        });

        if(!res.ok) throw new Error('Upload failed');
        message.innerText = `File uploaded`;
        const messageEl = document.getElementById("message");
        const JSONdata = await res.json();

        if (messageEl) {
            if (JSONdata.classification) {
            messageEl.textContent = `${JSONdata.message}: ${JSONdata.classification.className} (${(JSONdata.classification.probability * 100).toFixed(2)}%)`;
            } else {
            messageEl.textContent = `Error: No classification returned. Server message: ${JSONdata.message || 'Unknown'}`;
            }
        }

        form.reset(); 


    } catch(err){
        message.innerText = `File not uploaded, ${err.message}`; 
    }

}); 

document.getElementById("toDatabase").addEventListener("click", () => {
    window.location.href = '/database.html';
});

document.getElementById("toLogin").addEventListener("click", () => {
    window.location.href = '/login.html';
});

document.getElementById("toHome").addEventListener("click", () => {
    window.location.href = '/index.html';
});

document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("authToken");
    window.location.href = '/login.html';
});

});