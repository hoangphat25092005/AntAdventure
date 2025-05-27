const mongoose = require('mongoose');

const provinceDetailsSchema = new mongoose.Schema({
    provinceId: {
        type: String,
        required: true,
        unique: true
    },
    id: {
        type: String,
        required: false // Keep for backward compatibility
    },
    name: {
        type: String,
        required: true
    },
    introduction: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: false
    },
    famousFor: [{
        type: String,
        required: true
    }],
    attractions: [{
        type: String,
        required: true
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

provinceDetailsSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

const ProvinceDetails = mongoose.model('ProvinceDetails', provinceDetailsSchema);

module.exports = ProvinceDetails;