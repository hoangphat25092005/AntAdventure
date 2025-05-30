//creating user model 
const mongoose = require('mongoose');

//add who is admin and who is a client

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },    password: {
        type: String,
        required: function() {
            return !this.googleId; // Only require password for non-Google users
        },
        trim: true,
        minlength: 8
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    resetPasswordToken: {
        type: String,
    },    resetPasswordExpires: {
        type: Date    },    
    googleId: {
        type: String
    },
    avatar: {
        type: String,
        default: ''
    },
    avatar: {
        type: String,
        default: ''
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;