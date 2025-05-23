import express from "express"
import { addToCart, updateCart, getUserCart } from "../controllers/cartController.js"//add .js
import authUser from "../middleware/auth.js"

//using express server we will create router
const cartRouter=express.Router()
// using these functions we will create multiple endpoints
cartRouter.post('/get',authUser,getUserCart)//endpoint and function, when we hit this endpoint we will send cart data through api
cartRouter.post('/add',authUser,addToCart)
cartRouter.post('/update',authUser,updateCart)
// now if any one hits the api endpoint, token will be verified and using that token in the body we will get userId and after that the function, in that req.body we will get userId, we will use other req.body property to update product data in user's cart
// whenever user gets cart/update cart or add product in the cart, then we will add this middleware
export default cartRouter//used in server.js