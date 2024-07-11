const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
    heading: String,
    image: String,
    description: String,
    date: Date
}, { collection: 'news' });

module.exports = mongoose.model('News', newsSchema);
