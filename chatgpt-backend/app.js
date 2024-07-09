const express = require('express');
const createHttpError = require('http-errors');
const morgan = require('morgan');
const dotenv = require('dotenv').config();
const mongoose=require('./Connection/DatabaseConnection')
const cors=require('cors')
const CookieParser=require('cookie-parser')
const app = express();

app.use(cors({
    credentials:true,
    origin:["http://localhost:3001"]
}))
app.use(CookieParser())
app.use(morgan('dev'));
app.use(express.json());


const UserRouter = require("./Router/UserRouter");
const ChatRouter = require("./Router/ChatRouter");
app.get('/', async (req, res, next) => {
    res.send("Hello from Server");
});

app.use('/user', UserRouter)
app.use('/chat', ChatRouter)

// Error handling
app.use(async (req, res, next) => {
    next(createHttpError.NotFound("Something went wrong :("));
});

app.use((err, req, res, next) => {
    return res.status(err.status || 500).send({
        error: {
            status: err.status || 500,
            message: err.message || 'Internal Server Error'
        }
    });
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
});
