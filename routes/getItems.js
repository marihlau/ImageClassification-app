const db = require('../persistence');

module.exports = async (req, res) => {
    const images = await db.getItems();
    res.send(images);
};
