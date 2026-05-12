const express = require('express');
const router = express.Router();
const { getStates, getStateById, addState } = require('../controllers/stateController');
const { protect } = require('../middleware/auth');

router.route('/').get(getStates).post(protect, addState);
router.route('/:id').get(getStateById);

module.exports = router;