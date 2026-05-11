const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    userPhone: {
        type: String,
        default: ''
    },
    userEmail: {
        type: String,
        default: ''
    },
    itemType: {
        type: String,
        enum: ['Package', 'Hotel'],
        required: true
    },
    itemId: {
        type: String,
        required: true
    },
    itemName: {
        type: String,
        required: true
    },
    guests: {
        type: Number,
        required: true
    },
    date: {
        type: String, // Or Date
        required: true
    },
    totalAmount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Confirmed', 'Cancelled'],
        default: 'Confirmed' // Default to confirmed for simplicity
    },
    bookingId: {
        type: String,
        required: true,
        unique: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
