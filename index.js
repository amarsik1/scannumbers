const express = require("express");
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const artistRoute = require('./routes/artists');

app.use(bodyParser.json());
const PORT = process.env.PORT || 80;

app.use('/artists', artistRoute);

app.get('/', function (req, res) {
    res.send("created by amarsik1\n");
});


mongoose.connect('mongodb+srv://amarsik1:amarsik1@cluster0.xvgon.mongodb.net/artists', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, () => console.log("connected to DB"));

app.listen(PORT, () => {
    console.log("app is started in " + PORT + " port");
});