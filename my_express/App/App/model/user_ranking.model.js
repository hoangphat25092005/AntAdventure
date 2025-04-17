//user ranking model
const mongoose = require('mongoose');

const userRankingSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    points: {
        type: Number,
        required: true,
    }
});

const UserRanking = mongoose.model('UserRanking', userRankingSchema);

module.exports = UserRanking;
