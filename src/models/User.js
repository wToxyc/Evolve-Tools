const { Schema, model } = require('mongoose');

const userSchema = new Schema({
    id: { 
        type: String,
        required: true
    },
    activiy: {
        text: {
            type: Number,
            required: false,
            default: 0
        },
        voice: {
            type: Number,
            required: false,
            default: 0
        }
    },
    warns: [{
        mod: {
            type: String,
            required: true
        },
        reason: {
            type: String,
            required: true
        },
        date: {
            type: Date,
            required: true
        }
    }]
});

const User = model('User', userSchema);

module.exports = User;