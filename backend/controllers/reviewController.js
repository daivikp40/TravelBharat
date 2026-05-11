const Review = require('../models/Review');

// @desc    Get reviews for a state
// @route   GET /api/reviews/:stateId
const getReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ stateId: req.params.stateId })
            .populate('user', 'name')
            .sort({ createdAt: -1 });
        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add a review
// @route   POST /api/reviews
const addReview = async (req, res) => {
    try {
        const { stateId, rating, comment } = req.body;
        
        if (!stateId || !rating || !comment) {
            return res.status(400).json({ message: 'Please provide all fields' });
        }
        
        // Optional: Check if user already reviewed this state
        const alreadyReviewed = await Review.findOne({
            stateId,
            user: req.user.id
        });
        
        if (alreadyReviewed) {
            return res.status(400).json({ message: 'You have already reviewed this destination' });
        }
        
        const review = await Review.create({
            user: req.user.id,
            stateId,
            rating,
            comment
        });
        
        // Populate user name before returning
        await review.populate('user', 'name');
        
        res.status(201).json(review);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getReviews,
    addReview
};
