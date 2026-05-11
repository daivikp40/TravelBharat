const mongoose = require('mongoose');

const touristPlaceSchema = new mongoose.Schema({
    placeName: {
        type: String,
        required: true
    },
    state: {
        type: String,
        ref: 'State',
        required: true
    }, // This links the place directly to the State model above
    city: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: ['Heritage', 'Nature', 'Adventure', 'Religious'],
        required: true
    },
    description: {
        type: String,
        required: true
    },
    bestTimeToVisit: {
        type: String
    },
    locationMapLink: {
        type: String
    },
    images: [{
        type: String
    }], // Stores an array of image URLs
}, { timestamps: true });

module.exports = mongoose.model('TouristPlace', touristPlaceSchema);