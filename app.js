const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const ejsMate = require('ejs-mate');
const Gym = require('./models/gym');

mongoose.connect('mongodb://127.0.0.1:27017/gym-finder', {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', () => {
    console.log('Database connection established!');
});

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/gyms', async (req, res) => {
    const allGyms = await Gym.find({});
    res.render('gyms/index.ejs', {allGyms});
});


app.listen(3000, () => {
    console.log('Listening on port 3000');
});



