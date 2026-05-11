const express = require('express');
const router = express.Router();
const { getStates, getStateById, addState } = require('../controllers/stateController');

router.route('/').get(getStates).post(addState);
router.route('/:id').get(getStateById);

module.exports = router;