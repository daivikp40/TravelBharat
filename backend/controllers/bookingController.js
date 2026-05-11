const Booking = require('../models/Booking');

// @desc    Create a new booking
// @route   POST /api/bookings
const createBooking = async (req, res) => {
    try {
        const { itemType, itemId, itemName, guests, date, totalAmount, userName, userPhone, userEmail } = req.body;
        
        if (!itemType || !itemId || !itemName || !guests || !date || !totalAmount) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }
        
        // Generate a random booking ID like 'TB-123456'
        const bookingId = `TB-${Math.floor(100000 + Math.random() * 900000)}`;
        
        const booking = await Booking.create({
            user: req.user.id,
            userName: userName || req.user.name,
            userPhone: userPhone || req.user.phone || '',
            userEmail: userEmail || req.user.email || '',
            itemType,
            itemId,
            itemName,
            guests,
            date,
            totalAmount,
            bookingId
        });
        
        // Send Email Confirmation (using Ethereal for testing)
        try {
            const nodemailer = require('nodemailer');
            // Generate test SMTP service account from ethereal.email
            let testAccount = await nodemailer.createTestAccount();
            
            // create reusable transporter object using the default SMTP transport
            let transporter = nodemailer.createTransport({
                host: "smtp.ethereal.email",
                port: 587,
                secure: false, // true for 465, false for other ports
                auth: {
                    user: testAccount.user, // generated ethereal user
                    pass: testAccount.pass, // generated ethereal password
                },
            });
            
            // send mail with defined transport object
            let info = await transporter.sendMail({
                from: '"TravelBharat" <noreply@travelbharat.com>', // sender address
                to: req.user.email, // list of receivers
                subject: `Booking Confirmation - ${bookingId}`, // Subject line
                text: `Hello ${req.user.name},\n\nYour booking for ${itemName} has been confirmed!\nBooking ID: ${bookingId}\nDate: ${new Date(date).toLocaleDateString()}\nGuests: ${guests}\nTotal Amount: ₹${totalAmount}\n\nThank you for choosing TravelBharat!`, // plain text body
                html: `<b>Hello ${req.user.name},</b><br><br>Your booking for <b>${itemName}</b> has been confirmed!<br><b>Booking ID:</b> ${bookingId}<br><b>Date:</b> ${new Date(date).toLocaleDateString()}<br><b>Guests:</b> ${guests}<br><b>Total Amount:</b> ₹${totalAmount}<br><br>Thank you for choosing TravelBharat!`, // html body
            });
            
            console.log("Confirmation Email sent: %s", info.messageId);
            console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        } catch (emailErr) {
            console.error("Failed to send email", emailErr);
            // Don't fail the booking if email fails
        }
        
        res.status(201).json(booking);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user bookings
// @route   GET /api/bookings/my
const getMyBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get ALL bookings (admin only)
// @route   GET /api/bookings/admin/all
const getAllBookings = async (req, res) => {
    try {
        // Check if user is admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admin only.' });
        }
        
        const bookings = await Booking.find()
            .populate('user', 'name email phone')
            .sort({ createdAt: -1 });
        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get booking stats (admin only)
// @route   GET /api/bookings/admin/stats
const getBookingStats = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admin only.' });
        }
        
        const totalBookings = await Booking.countDocuments();
        const totalRevenue = await Booking.aggregate([
            { $group: { _id: null, total: { $sum: '$totalAmount' } } }
        ]);
        const confirmedBookings = await Booking.countDocuments({ status: 'Confirmed' });
        const pendingBookings = await Booking.countDocuments({ status: 'Pending' });
        const cancelledBookings = await Booking.countDocuments({ status: 'Cancelled' });
        
        // Bookings by package
        const bookingsByPackage = await Booking.aggregate([
            { $group: { 
                _id: '$itemName', 
                count: { $sum: 1 }, 
                totalRevenue: { $sum: '$totalAmount' },
                totalGuests: { $sum: '$guests' }
            }},
            { $sort: { count: -1 } }
        ]);
        
        // Monthly bookings
        const monthlyBookings = await Booking.aggregate([
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
                    count: { $sum: 1 },
                    revenue: { $sum: '$totalAmount' }
                }
            },
            { $sort: { _id: 1 } }
        ]);
        
        res.status(200).json({
            totalBookings,
            totalRevenue: totalRevenue[0]?.total || 0,
            confirmedBookings,
            pendingBookings,
            cancelledBookings,
            bookingsByPackage,
            monthlyBookings
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Cancel a booking
// @route   PATCH /api/bookings/:id/cancel
const cancelBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // Check for user ownership or admin role
        if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ message: 'User not authorized to cancel this booking' });
        }

        if (booking.status === 'Cancelled') {
            return res.status(400).json({ message: 'Booking is already cancelled' });
        }

        booking.status = 'Cancelled';
        await booking.save();

        res.status(200).json(booking);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createBooking,
    getMyBookings,
    getAllBookings,
    getBookingStats,
    cancelBooking
};
