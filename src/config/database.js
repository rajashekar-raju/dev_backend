const mongoose = require('mongoose');

const connectDB = async () => {
    await mongoose.connect("mongodb+srv://rajashekar:UmxMEGpUtTlzRaex@rajashekar.2uoxm.mongodb.net/devTinder");
}

module.exports = connectDB;