const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');

// Config
const SERVER_URL = 'http://localhost:3000';
const USERNAME = 'CAB432';
const PASSWORD = 'supersecret';
const IMAGE_PATH = 'uploads/Skjermbilde 2025-08-27 kl. 14.40.32.png'; // replace with your sample image
const DURATION_MINUTES = 5;

async function getToken() {
  try {
    const response = await axios.post(`${SERVER_URL}/login`, {
      username: USERNAME,
      password: PASSWORD
    }, { headers: { 'Content-Type': 'application/json' } });
    return response.data.authToken;
  } catch (err) {
    console.error('Error logging in:', err.message);
    process.exit(1);
  }
}

async function stressUpload(token) {
  const endTime = Date.now() + DURATION_MINUTES * 60 * 1000;
  let count = 0;

  while (Date.now() < endTime) {
    const form = new FormData();
    form.append('image', fs.createReadStream(IMAGE_PATH));

    try {
      await axios.post(`${SERVER_URL}/uploads`, form, {
        headers: { 
          ...form.getHeaders(),
          Authorization: `Bearer ${token}`
        }
      });
      count++;
      if (count % 5 === 0) console.log(`Upload #${count} done`);
    } catch (err) {
      console.error('Upload error:', err.message);
    }
  }

  console.log('Stress test finished. Total uploads:', count);
}

async function main() {
  const token = await getToken();
  console.log('✅ Logged in. Starting stress test...');
  await stressUpload(token);
}

main();

