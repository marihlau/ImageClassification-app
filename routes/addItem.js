const db = require('../persistence');
const {v4 : uuid} = require('uuid');

module.exports = async (req, res) => {
    const image = {
        id: uuid(),
        name: req.body.name,
        completed: false,
    };

    await db.storeItem(image);
    res.send(image);
};