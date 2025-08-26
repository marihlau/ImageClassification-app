const { init, getDB } = require('./persistence/sqlite');

(async () => {
  try {
    await init(); // initialize DB
    const db = getDB();

    const imageId = process.argv[2]; // get image ID from command line
    if (!imageId) {
      console.error("Please provide an image ID to delete. Example: node deleteImage.js 16");
      process.exit(1);
    }

    const result = await db.run("DELETE FROM images WHERE id = ?", [imageId]);

    if (result.changes === 0) {
      console.log(`No image found with ID ${imageId}`);
    } else {
      console.log(`Image with ID ${imageId} deleted successfully`);
    }

    process.exit(0);
  } catch (err) {
    console.error("Error deleting image:", err);
    process.exit(1);
  }
})();
