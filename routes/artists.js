const express = require("express");
const router = express.Router();
const Artist = require('../models/Artist');


// GET ALL ARTIST
router.get('/', async (req, res) => {
    try {
        const artists = await Artist.find();
        res.json(artists);
    } catch (err) {
        res.json({message: err})
    }
});

// SPECIFIC ARTIST
router.get('/:artistId', async (req, res) => {
    try {
        const artist = await Artist.findById(req.params.artistId);
        res.json(artist);
    } catch (err) {
        res.json({message: err})
    }
});
// SUBMITS A ARTIST
router.post('/', async (req, res) => {
    const artist = new Artist({
        name: req.body.name,
        description: req.body.description
    });
    try {
        const savedArtist = await artist.save();
        res.json(savedArtist);
    } catch (err) {
        res.json({message: err})
    }
});

//DELETE
router.delete('/:artistId', async (req, res) => {
    try {
        const removerArtist = await Artist.remove({_id: req.params.artistId});
        res.json(removerArtist)
    } catch (err) {
        res.json({message: err})
    }
});

//UPDATE
router.patch('/:artistId', async (req, res) => {
    try {
        const updatedArtist = await Artist.updateOne({_id: req.params.artistId},
            {
                $set: {
                    name: req.body.name
                }
            });
        res.json(updatedArtist)
    } catch (err) {
        res.json({message: err})
    }
});


module.exports = router;