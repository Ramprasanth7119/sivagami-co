// using cors we can allow frontend ip to access the backend
//using dotenv -we can use env variables in our project
// using express, we can create apis
// using jsonwebtoken, we can enable user authentication and user will be logged in to our website
// using mongoose, it will manage our db connectivity
//using multer, it will allow us to store images in cloudinary storage
// nodemon will restart the package, whenever we will make any changes in code
//razorpay and stripe to setup online payment integration
//using validator, we will check data coming from user is valid or not
// using bcrypt, we can encrypt user password and store in db

// in config folder we will store all configurations
// in middleware, we will store all backend middleware
// in models, we will store all models of mongoose where we will define schema
// in controllers folder, we will manage all logics of backend
// in routes folder, we will manage express servers routes
// whenever we type start, it will run node server, we will use start in deployment and at local server we will use npm run server
// after using module, we can use import statements in our project

import express from "express"//to create a basic server

import cors from 'cors'
import 'dotenv/config'//we will get support of .env file in our project
import connectDB from "./config/mongodb.js"//add .js
import connectCloudinary from "./config/cloudinary.js"
import userRouter from "./routes/userRoute.js"
import productRouter from "./routes/productRoute.js"
import bodyParser from "body-parser"
import cartRouter from "./routes/cartRoute.js"
import orderRouter from "./routes/orderRoute.js"

// App Config
const app=express()//here we will use express package to create instance of express server
const port=process.env.PORT || 4000//if port is available in env, it will be used, else it will use port 4000

//middlewares
// to add middleware we will use
app.use(express.json())//whatever request we will get that will be passed using json
app.use(cors())//we can access backend from any ip
app.use(bodyParser.urlencoded({ extended: true }));
connectDB()
connectCloudinary()

// api endpoints

app.use("/api/user",userRouter)
app.use("/api/product",productRouter)
app.use("/api/cart",cartRouter)
app.use("/api/order",orderRouter)//endpoint and orderRouter function from orderRoutes.js
// first add function in routes and we have added router in server.js with endpoint
// now we will create middleware, using the middleware we will authenticate the user
app.get('/',(req,res)=>{//path 
    res.send("API Working")//this should be displayed whenever we open or hit the endpoint of localhost 4000, and when we hit the endpoint on user it will be executed as a get request
})
// after that we will add config in our backend project, config for db connectivity
//to start express server
app.listen(port,()=>{
    console.log("Server started on PORT : "+port);
    
})

