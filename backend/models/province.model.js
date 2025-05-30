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
    },    name: {
        type: String,
        required: true
    },
    introduction: {
        type: String,
        required: false,
        default: ''
    },
    imageUrl: {
        type: String,
        required: false
    },
    famousFor: {
        type: [String],
        required: false,
        default: []
    },
    attractions: {
        type: [String],
        required: false,
        default: []
    },
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