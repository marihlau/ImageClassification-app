const form = document.getElementById('imageUpload');
const message = document.getElementById('message');

form.addEventListener('submit', async(e)=>{
    e.preventDefault();
    const data = new FormData(form);

    try{
        const res = await fetch('/uploads', {
            method: 'POST',
            body: data
        });

        if(!res.ok) throw new Error('Upload failed');
        //const text = await res.text();
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

document.getElementById("todatabase").addEventListener("click", () => {
    window.location.href = '/uploads.html';
});


