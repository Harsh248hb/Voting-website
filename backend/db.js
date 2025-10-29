const mongoose = require('mongoose');
require('dotenv').config(); // <== This is required to load .env

const mongoURI = process.env.MONGO_URI;

if (!mongoURI) {
    console.error("MongoDB URI is not defined in .env");
    process.exit(1);
}

mongoose.connect(mongoURI)
.then(() => console.log(" MongoDB connected"))
.catch(err => console.error(" MongoDB connection error:", err));

module.exports = mongoose;