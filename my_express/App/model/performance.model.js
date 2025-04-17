//performance model
const mongoose = require('mongoose');

const performanceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    }, 
    streak: {
        type: Number,
        required: true,
        default: 0,
    },
    total_province_unlocked: {
        type: Number,
        required: true,
        default: 0
    },
    total_province_locked: {
        type: Number,
        required: true,
        default: 0
    }
});

const Performance = mongoose.model('Performance', performanceSchema);

module.exports = Performance;
