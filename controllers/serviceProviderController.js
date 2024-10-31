const ServiceProvider = require('../models/ServiceProvider');

exports.getServiceProviders = async (req, res) => {
    try {
        const { serviceType, location } = req.query;
        const query = {};
        
        if (serviceType) query.serviceType = serviceType;
        if (location) query.location = location;

        const providers = await ServiceProvider.find(query)
            .sort({ rating: -1 });
        res.json(providers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getTimeSlots = async (req, res) => {
    try {
        const { providerId, date } = req.query;
        const provider = await ServiceProvider.findById(providerId);
        
        if (!provider) {
            return res.status(404).json({ error: 'Provider not found' });
        }

        const selectedDate = new Date(date);
        const dayOfWeek = selectedDate.toLocaleString('en-US', { weekday: 'long' });

        if (!provider.availableDays.includes(dayOfWeek)) {
            return res.json({ timeSlots: [] });
        }

        // Generate time slots between working hours
        const [startHour] = provider.workingHours.start.split(':');
        const [endHour] = provider.workingHours.end.split(':');
        const timeSlots = [];

        for (let hour = parseInt(startHour); hour < parseInt(endHour); hour++) {
            timeSlots.push(`${hour.toString().padStart(2, '0')}:00`);
            timeSlots.push(`${hour.toString().padStart(2, '0')}:30`);
        }

        res.json({ timeSlots });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.addReview = async (req, res) => {
    try {
        const { rating, comment } = req.body;
        const provider = await ServiceProvider.findById(req.params.id);

        if (!provider) {
            return res.status(404).json({ error: 'Provider not found' });
        }

        provider.reviews.push({
            userId: req.user._id,
            rating,
            comment
        });

        // Update average rating
        const totalRating = provider.reviews.reduce((sum, review) => sum + review.rating, 0);
        provider.rating = totalRating / provider.reviews.length;

        await provider.save();
        res.json(provider);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
