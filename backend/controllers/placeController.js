const TouristPlace = require('../models/TouristPlace');
const State = require('../models/State');

// @desc    Get all tourist places (optionally filter by state)
// @route   GET /api/places
const getPlaces = async (req, res) => {
    try {
        // State ID is a string like 'rajasthan'
        const filter = req.query.state ? { state: req.query.state.toLowerCase() } : {};
        const places = await TouristPlace.find(filter).populate('state', 'name');
        res.status(200).json(places);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add a new tourist place
// @route   POST /api/places
const addPlace = async (req, res) => {
    try {
        const newPlace = new TouristPlace(req.body);
        const savedPlace = await newPlace.save();
        res.status(201).json(savedPlace);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = { getPlaces, addPlace };