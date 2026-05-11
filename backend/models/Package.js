const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    title: { type: String, required: true },
    subtitle: { type: String },
    duration: { type: String },
    price: { type: Number, required: true },
    originalPrice: { type: Number },
    rating: { type: Number, default: 4.5 },
    reviews: { type: Number, default: 0 },
    image: { type: String },
    states: [{ type: String }],
    includes: [{ type: String }],
    highlights: [{ type: String }],
    badge: { type: String },
    badgeColor: { type: String },
    category: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Package', packageSchema);
