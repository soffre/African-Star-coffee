const express = require('express');

const app = express();

app.use(express.json());


//all routes will be here
app.use('/', (req, res, next) =>{ 
    res.status(200).json({
        status: 'success',
        message: "Successfull the server is start"
    })
})


app.listen(4000, ()  =>{
    console.log("Server up and running")
})