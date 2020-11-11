const express = require("express");
const app = express();

const PORT = process.env.PORT || 80;


artists = [
    {
        id: 1,
        name: "Melya"
    },
    {
        id: 2,
        name: "Sula"
    },
    {
        id: 3,
        name: "Danila"
    },
];

app.get('/', function (req, res) {
    res.send("created by amarsik1\n");
});


app.get('/artists', function (req, res) {
    res.send(artists);
});

app.get('/artist/:id', function (req, res) {
    let artist = artists.find(function (artist) {
        return artist.id === Number(req.params.id)
    });
    res.send(artist);
});

app.post('/artist', function (req, res) {
    console.log(req.body);
    let artist = {
        id: Date.now(),
        name: req.body.name
    };
    artists.push(artist);
    res.send(artist);
});



app.listen(PORT, () => {
    console.log("app is started in "+PORT+" port");
});