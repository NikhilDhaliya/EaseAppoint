const mongoose = require('mongoose');

const serviceProviderSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    serviceType: {
        type: String,
        required: true,
        enum: ['salon', 'hospital']
    },
    location: {
        type: String,
        required: true
    },
    workingHours: {
        start: String,
        end: String
    },
    availableDays: [{
        type: String,
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    }],
    rating: {
        type: Number,
        default: 0
    },
    reviews: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        rating: Number,
        comment: String,
        date: {
            type: Date,
            default: Date.now
        }
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('ServiceProvider', serviceProviderSchema);
