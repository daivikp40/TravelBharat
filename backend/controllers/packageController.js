const Package = require('../models/Package');

// @desc    Get all packages
// @route   GET /api/packages
const getPackages = async (req, res) => {
    try {
        const { category } = req.query;
        let query = {};
        if (category && category !== 'All') {
            query.category = category;
        }
        const packages = await Package.find(query);
        res.status(200).json(packages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getPackages };
