const dotenv = require("dotenv").config();
const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://aelsayed777888:010150150@cluster0.azq6fdl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0").then(() => {
    console.log("MongoDB Connected");
}).catch(err => console.log(err.message));

mongoose.connection.on('connected', () => {
    console.log('Connected to MongoDB Cloud');
});

mongoose.connection.on('error', (err) => {
    console.log('Error connecting to MongoDB Cloud');
    console.log(err.message);
});

module.exports = mongoose;
