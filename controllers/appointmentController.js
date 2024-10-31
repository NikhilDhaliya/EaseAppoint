const Appointment = require('../models/Appointment');

// Get all appointments for a user
exports.getAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find({ userId: req.user._id })
            .sort({ date: 1, time: 1 });
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Create a new appointment
exports.createAppointment = async (req, res) => {
    try {
        const { serviceType, location, date, time } = req.body;
        
        // Check if the time slot is available
        const existingAppointment = await Appointment.findOne({
            serviceType,
            location,
            date,
            time,
            status: { $ne: 'cancelled' }
        });

        if (existingAppointment) {
            return res.status(400).json({ error: 'This time slot is already booked' });
        }

        const appointment = new Appointment({
            userId: req.user._id,
            serviceType,
            location,
            date,
            time
        });

        await appointment.save();
        res.status(201).json(appointment);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Cancel an appointment
exports.cancelAppointment = async (req, res) => {
    try {
        const appointment = await Appointment.findOne({
            _id: req.params.id,
            userId: req.user._id
        });

        if (!appointment) {
            return res.status(404).json({ error: 'Appointment not found' });
        }

        appointment.status = 'cancelled';
        await appointment.save();
        res.json(appointment);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
