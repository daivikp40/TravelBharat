const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    name: { type: String, required: true },
    location: { type: String, required: true },
    state: { type: String, required: true },
    stars: { type: Number, default: 3 },
    rating: { type: Number, default: 4.0 },
    reviews: { type: Number, default: 0 },
    price: { type: Number, required: true },
    image: { type: String },
    amenities: [{ type: String }],
    type: { type: String },
    tag: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Hotel', hotelSchema);
