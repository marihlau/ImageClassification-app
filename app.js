//Imports and dependencies
const express = require('express')
const multer = require('multer')
const tf = require('@tensorflow/tfjs');
const mobilenet = require('@tensorflow-models/mobilenet');
const path = require('path');
const getItems = require('./routes/getItems');
const addItem = require('./routes/addItem');
const deleteItem = require('./routes/deleteItem');
const {Image} = require ('image-js');
const { init, getDB } = require('./persistence/sqlite');
const JWT = require("./public/js/jwt.js");
const fs = require('fs');

//setting up the app using express
const app = express()


// Using the public folder
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

//database routing
app.get('/images', getItems);
app.post('/images', addItem);
app.delete('/images/:id', deleteItem);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1450 * 1450 } //max file size 2MB
});

let db; //initialising database
(async () => {
  await init();
  db = getDB();
})();

//loading the tensorflow MobileNet model
let model;
(async () => {
  model = await mobilenet.load();
  console.log("✅ MobileNet model loaded");
})();

// Making an user and admin user for demo
const users = {
   CAB432: {
      password: "supersecret",
      admin: false,
   },
   admin: {
      password: "admin",
      admin: true,
   },
};


app.post("/signup", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Username and password required" });
  }

  if (users[username]) {
    return res.status(409).json({ error: "User already exists" });
  }

  users[username] = { password, admin: false };

  console.log("✅ User registered:", username);
  res.status(201).json({ message: "User registered successfully" });
});

app.post("/login", (req, res) => {
   const { username, password } = req.body;
   const user = users[username];

   if (!user || password !== user.password) {
      return res.status(401).json({ error: "Invalid username or password" });
   }
   const token = JWT.generateAccessToken({ username });
   res.json({ authToken: token, admin: user.admin });
});



// Main page protected by our authentication middleware
app.get("/", JWT.authenticateToken, (req, res) => {
   res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Admin page requires admin permissions
app.get("/admin", JWT.authenticateToken, (req, res) => {
   const user = users[req.user.username];
   
   if (!user || !user.admin) {
      console.log("Unauthorised user requested admin content.");
      return res.sendStatus(403);
   }

   res.sendFile(path.join(__dirname, "public", "admin.html"));
});

//image upload and classification of image
app.post('/uploads',JWT.authenticateToken, upload.single('image'), async (req, res) => {
  try{
    if (!req.file) return res.status(400).send('No file uploaded!');

    const image = await Image.load(req.file.buffer);
    const tensor = tf.browser.fromPixels(image).expandDims(0);
    const predictions = await model.classify(tensor);
    const best = predictions[0];

    //store in database
    const sql = `INSERT INTO images (name, image, label, confidence, contentType) VALUES (?, ?, ?, ?, ?)`;
    const values = [
      req.file.originalname, 
      req.file.buffer, 
      best.className, 
      best.probability,
      req.file.mimetype
    ];
    const result = await db.run(sql, values);
    
    res.json({ 
      message: "Image uploaded and classified successfully", 
      classification: best,
      imageId: result.lastID
    });
  } catch (error) {
    console.error("Error processing image:", error);
    res.status(500).send("Error processing image");
  }
});


//get the image from id
app.get("/uploads/:id",JWT.authenticateToken, async (req, res) => {
  try {
    const rows = await db.all("SELECT * FROM images WHERE id = ?", [
      req.params.id,
    ]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "Image not found." });
    }

    const imageRecord = rows[0];

    if (!imageRecord.image) {
      return res.status(500).json({ error: "No image data found in DB." });
    }

    res.set("Content-Type", imageRecord.contentType);
    res.send(imageRecord.image);

  } catch (err) {
    console.error("Error fetching image:", err);
    res.status(500).json({ error: "Error fetching image" });
  }
});

//getting data for all images in database
app.get('/uploads',JWT.authenticateToken, async (req, res) => {
  try {
    const rows = await db.all('SELECT id, name, label, confidence FROM images');
    console.log("Query successful, found", rows.length, "images");
  
    res.json(rows);
  } catch (error) {
    console.error("Error fetching images:", error.message);
    console.error("Error code:", error.code);
    res.status(500).json({ error: "Error fetching images", details: error.message });
  }
});

//deleting from database
app.delete('/uploads/:id', JWT.authenticateToken, async (req, res) => {
  try{
    const user = users[req.user.username]; 
    if(!user || !user.admin){
      return res.status(403).json({error: "Forbidden: Admins only"});
    }

    const result = await db.run("DELETE FROM images WHERE id = ?", [req.params.id]);


    if(result.changes === 0){
      return res.status(404).json({ error: "Image not found" });
    }
    res.json({ message: "Image deleted successfully" });
  }
  catch(err){
    console.error("Error deleting image:", err);
    res.status(500).json({ error: "Error deleting image" });
  }
});

// CPU stress test endpoint
app.get('/stress', async (req, res) => {
  try {
    const duration = 5 * 60 * 1000; // 5 minutes
    const startTime = Date.now();
    let iteration = 0;

    while (Date.now() - startTime < duration) {
      const a = tf.randomNormal([1500, 1500]);
      const b = tf.randomNormal([1500, 1500]);
      const c = tf.matMul(a, b); 
      c.dataSync(); 

      iteration++;

      await new Promise(resolve => setTimeout(resolve, 50));
      if (iteration % 10 === 0) {
      console.log(`Iteration ${iteration} completed`);
      }
    }

    res.json({ message: `CPU stress test completed`, iterations: iteration });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error during stress test" });
  }
});


module.exports = app