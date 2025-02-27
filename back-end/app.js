require('dotenv').config({path: `${process.cwd()}/.env`});
const express = require('express');
const path = require('path')
const cors = require('cors')
const authRoute = require('./route/authRoute');
const categoryRoute = require('./route/categoryRoute');
const productRoute = require('./route/productRoute');
const addressRoute = require('./route/addressRoute');
const userRoute = require('./route/userRoute');
const adminRoute = require('./route/adminRoute');
const catchAsync = require('./utils/catchAsync');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controller/errorController');

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({extended: false}))
app.use(express.static(path.join(__dirname, 'public')))


//all routes will be here
app.use('/api/v1/auth', authRoute)
app.use('/api/v1/category', categoryRoute)
app.use('/api/v1/product', productRoute)
app.use('/api/v1/shippingAddress',addressRoute)
app.use('/api/v1/users',userRoute)
app.use('/api/v1/admin',adminRoute)


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