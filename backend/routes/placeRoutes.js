const express = require('express');
const router = express.Router();
const { getPlaces, addPlace } = require('../controllers/placeController');

router.route('/').get(getPlaces).post(addPlace);

module.exports = router;