const express = require('express');
const router = express.Router();
const { createBooking, getMyBookings, getAllBookings, getBookingStats, cancelBooking } = require('../controllers/bookingController');
const { protect } = require('../middleware/auth');

router.route('/').post(protect, createBooking);
router.route('/my').get(protect, getMyBookings);
router.route('/admin/all').get(protect, getAllBookings);
router.route('/admin/stats').get(protect, getBookingStats);
router.route('/:id/cancel').patch(protect, cancelBooking);

module.exports = router;
