const { Schema, model } = require('mongoose');

const ticketSchema = new Schema({
    user: {
        type: String,
        required: true
    },
    channel: {
        type: String,
        required: true
    }
});

const Ticket = model('Ticket', ticketSchema);

module.exports = Ticket;