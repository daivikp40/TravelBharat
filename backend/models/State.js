const mongoose = require('mongoose');

const stateSchema = new mongoose.Schema({
    _id: { type: String, required: true }, // Using string ID like 'rajasthan'
    name: { type: String, required: true },
    description: { type: String, required: true },
    imageUrl: { type: String },
    region: { type: String },
    rating: { type: Number, default: 4.5 },
    visitors: { type: String },
    bestSeason: { type: String },
    placesCount: { type: Number },
    capital: { type: String },
    language: { type: String },
    highlights: [{ type: String }],
    bgGradient: { type: String },
    
    // Safety info
    safetyScore: { type: Number },
    safetyLevel: { type: String },
    emergencyPhone: { type: String },
    tourismPhone: { type: String },
    safetyNotes: { type: String },
    hospitalNearby: { type: String },
    policeHelpline: { type: String },
    ambulance: { type: String },
    livePhotos: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.model('State', stateSchema);