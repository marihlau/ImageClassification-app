//Imports and dependencies
const express = require('express')
const multer = require('multer')
const tf = require('@tensorflow/tfjs');
const mobilenet = require('@tensorflow-models/mobilenet');
//const mysql = require('mysql2/promise');
const path = require('path');
const getItems = require('./routes/getItems');
const addItem = require('./routes/addItem');
const deleteItem = require('./routes/deleteItem');
const {Image} = require ('image-js');
const { init, getDB } = require('./persistence/sqlite');

//setting up the app using express
const app = express()

// Using the public folder
app.use(express.static(path.join(__dirname, 'public')));

//database routing
app.get('/images', getItems);
app.post('/images', addItem);
app.delete('/images/:id', deleteItem);
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024 } // 2 MB max
});

let db;
(async () => {
  await init();
  db = getDB();
})();

//mysql
// const pool = mysql.createPool({
//   host: 'localhost',
//   user: 'root',
//   password: 'databasepassword',
//   database: 'test'
// });

//Test database connection
// db.getConnection()
//   .then(connection => {
//     console.log('✅ database connected successfully');
//     connection.release();
//   })
//   .catch(err => {
//     console.error('MySQL connection failed:', err.message);
//   });

// Insert example
// await db.run(
//   'INSERT INTO images (name, image, label, confidence, contentType) VALUES (?, ?, ?, ?, ?)',
//   [req.file.originalname, req.file.buffer, best.className, best.probability, req.file.mimetype]
// );

// Select example
//const rows = await db.all('SELECT id, name, label, confidence FROM images');


//uploading the images to memory storage
// Using Multer for file uploads
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, 'uploads/'),
//   filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
// });


//loading the tensorflow MobileNet model
let model;
(async () => {
  model = await mobilenet.load();
  console.log("✅ MobileNet model loaded");
})();

//image upload and classification of image
app.post('/uploads', upload.single('image'), async (req, res) => {
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
app.get("/uploads/:id", async (req, res) => {
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
app.get('/uploads', async (req, res) => {
  try {
    const rows = await db.all('SELECT id, name, label, confidence FROM images');
    console.log("Query successful, found", rows.length, "images");
    
    if (rows.length === 0) return res.status(404).json({ message: "No images found." });
    res.json(rows);
  } catch (error) {
    console.error("Error fetching images:", error.message);
    console.error("Error code:", error.code);
    res.status(500).json({ error: "Error fetching images", details: error.message });
  }
});

module.exports = app