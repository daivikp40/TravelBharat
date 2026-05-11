const Hotel = require('../models/Hotel');

// @desc    Get all hotels
// @route   GET /api/hotels
const getHotels = async (req, res) => {
    try {
        const { state, type } = req.query;
        let query = {};
        if (state && state !== 'All') query.state = state;
        if (type && type !== 'All') query.type = type;
        
        const hotels = await Hotel.find(query);
        res.status(200).json(hotels);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getHotels };
