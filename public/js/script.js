document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById('imageUpload');
  const message = document.getElementById('message');
  const token = localStorage.getItem("authToken"); 
  const userStatus = document.getElementById("userStatus");
  const admin = JSON.parse(localStorage.getItem("isAdmin")); 
  const logoutBtn = document.getElementById("logoutBtn");
  const loginBtn = document.getElementById("toLogin");

    if (!token) {
        if (logoutBtn) logoutBtn.style.display = "none";  // hide logout
        if (loginBtn) loginBtn.style.display = "inline-block"; // show login
        userStatus.innerText = "Not logged in";
        userStatus.style.color = "#2f4156";
    } else if (admin) {
        if (logoutBtn) logoutBtn.style.display = "inline-block"; // show logout
        if (loginBtn) loginBtn.style.display = "none";
        userStatus.innerText = "Logged in as admin";
        userStatus.style.color = "#2f4156";
    } else {
        if (logoutBtn) logoutBtn.style.display = "inline-block"; // show logout
        if (loginBtn) loginBtn.style.display = "none";
        userStatus.innerText = "Logged in as user";
        userStatus.style.color = "#2f4156";
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
        if (!token) {
            alert("You must be logged in to access the database.");
        } else {
            window.location.href = '/database.html';
        }
    });

    document.getElementById("toLogin").addEventListener("click", () => {
        window.location.href = '/login.html';
    });

    if (logoutBtn) {
        logoutBtn.addEventListener("click", (e) => {
            e.preventDefault();
            localStorage.removeItem("authToken");
            localStorage.removeItem("isAdmin");
            userStatus.innerText = "Not logged in";
            userStatus.style.color = "red";
            logoutBtn.style.display = "none";
            loginBtn.style.display = "inline-block";
        });
    }

});