import express from "express"
import {placeOrder, placeOrderStripe, placeOrderRazorpay, allOrders, userOrders, updateStatus, verifyStripe, verifyRazorpay} from "../controllers/orderController.js"
import adminAuth from "../middleware/adminAuth.js"
import authUser from "../middleware/auth.js"

const orderRouter=express.Router()
// we will use these controller functions and orderRouter to create multiple endpoints
// Admin features
orderRouter.post("/list",adminAuth,allOrders)//get all order details in admin panel, whenever we will hit this endpoint, then this controller function will be executed, and we have added admin auth middleware, first we have to send token of admin, then only we will receive all orders data
orderRouter.post("/status",adminAuth,updateStatus)//admin feature to update order status, endpoint and function

// Payment features
orderRouter.post("/place",authUser,placeOrder)//for cod, we will use this endpoint, add authentication, it will send user's id, whenever we will hit this api, we have to provide token in header
orderRouter.post("/stripe",authUser,placeOrderStripe)//for stripe, we need authUser middleware
orderRouter.post("/razorpay",authUser,placeOrderRazorpay)//for stripe, we need authUser middleware

// User feature
orderRouter.post("/userorders",authUser,userOrders)//endpoint and userOrders controller function, authUser-we will get userId when we provide the token and using that user id we can get orders of particular user and we can return it as a response, use this endpoint to display orders in our frontend in orders.jsx file


//verify payment
orderRouter.post("/verifyStripe",authUser,verifyStripe)
orderRouter.post("/verifyRazorpay",authUser,verifyRazorpay)//pass token in headers and razorpayorderid in json body
export default orderRouter