const State = require('../models/State');

// @desc    Get all states (with optional filtering)
// @route   GET /api/states
const getStates = async (req, res) => {
    try {
        const { region, search } = req.query;
        let query = {};
        if (region && region !== 'All') {
            query.region = region;
        }
        if (search) {
            query.name = { $regex: search, $options: 'i' };
        }
        const states = await State.find(query);
        res.status(200).json(states);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get state by ID
// @route   GET /api/states/:id
const getStateById = async (req, res) => {
    try {
        const state = await State.findById(req.params.id);
        if (!state) return res.status(404).json({ message: 'State not found' });
        res.status(200).json(state);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add a new state
// @route   POST /api/states
const addState = async (req, res) => {
    try {
        const { name, description, imageUrl } = req.body;
        const newState = new State({ name, description, imageUrl });
        const savedState = await newState.save();
        res.status(201).json(savedState);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = { getStates, getStateById, addState };