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
    sanctions: [{
        mod: {
            type: String,
            required: true
        },
        reason: {
            type: String,
            required: false,
            default: 'Aucune raison spécifiée'
        },
        date: {
            type: Date,
            required: true
        },
        type: {
            type: String,
            required: true,
            enum: ['ban', 'kick', 'timeout', 'mute', 'warn']
        }
    }]
});

const User = model('User', userSchema);

module.exports = User;