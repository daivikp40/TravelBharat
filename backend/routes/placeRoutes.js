const express = require('express');
const router = express.Router();
const { getPlaces, addPlace } = require('../controllers/placeController');
const { protect } = require('../middleware/auth');

router.route('/').get(getPlaces).post(protect, addPlace);

module.exports = router;