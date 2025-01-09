const mongoose = require('mongoose');
require('dotenv').config();
const MONGO_URI = process.env.MONGO_URI;
require('colors');

const connectDb = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Database connected!'.green);
    } catch (err) {
        console.log('Failed to connect database!'.red, err);
    }
}

module.exports = connectDb;