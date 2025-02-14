require('dotenv').config({path: `${process.cwd()}/.env`});
const express = require('express');
const authRoute = require('./route/authRoute');
const catchAsync = require('./utils/catchAsync');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controller/errorController');

const app = express();

app.use(express.json());


//all routes will be here
app.use('/api/v1/auth', authRoute)


// handle to any route request that does not exist
app.use('*',
    catchAsync(async (req, res, next) =>{
        throw new AppError(`can't find ${req.originalUrl} on this server`, 404)
    })
)

app.use(globalErrorHandler); // handle any thrown error within the app

const PORT =  process.env.APP_PORT || 4000;
app.listen(PORT, ()  =>{
    console.log("Server up and running", PORT)
})