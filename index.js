const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// Define the News model
const newsSchema = new mongoose.Schema({
    heading: String,
    image: String,
    description: String,
    date: Date
}, { collection: 'news' });

const News = mongoose.model('News', newsSchema);

// Routes
app.get('/', (req, res) => {
    res.render('home');
});
// Route to render admin page
app.get('/admin', (req, res) => {
    res.render('admin');
});

// Route to handle form submission for adding news articles
app.post('/admin/add-news', async (req, res) => {
    try {
        const { heading, image, description, date } = req.body;

        // Create a new News object using the News model
        const newArticle = new News({
            heading: heading,
            image: image,
            description: description,
            date: new Date(date), // Assuming date is passed as YYYY-MM-DD format
        });

        // Save the new article to MongoDB
        await newArticle.save();

        // Redirect back to admin page after successful submission
        res.redirect('/admin');
    } catch (error) {
        console.error('Error adding news article:', error);
        res.status(500).send('Error adding news article');
    }
});
app.get('/weather', async (req, res) => {
    try {
        const lat = '13.08784000';
        const lon = '80.27847000';
        const apiKey = process.env.OPENWEATHERMAP_API_KEY;
        const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;

        const response = await axios.get(weatherUrl);
        const weatherData = response.data;

        res.render('weather', { weather: weatherData });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching weather data');
    }
});






app.get('/latest-news', async (req, res) => {
    try {
        const news = await News.find().sort({ date: -1 });
        res.render('latest-news', { news: news });
    } catch (error) {
        console.error('Error fetching news:', error);
        res.status(500).send('Error fetching news');
    }
});


app.get('/contact-us', (req, res) => {
    res.render('contact-us');
});

app.post('/contact-us', (req, res) => {
    const { name, email, message } = req.body;
    console.log(`Received message from ${name} (${email}): ${message}`);
    res.send('Thank you for your message!');
});

app.get('/about-us', (req, res) => {
    res.render('about-us');
});

app.get('/sports-news', (req, res) => {
    res.render('sports-news');
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
