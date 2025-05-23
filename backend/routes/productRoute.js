import express from "express"

import { addProduct, removeProduct, listProducts, singleProduct } from "../controllers/productController.js"
import upload from "../middleware/multer.js"
import adminAuth from "../middleware/adminAuth.js"

//use express package to create one router
const productRouter=express.Router()

productRouter.post("/add",adminAuth,upload.fields([{name:'image1',maxCount:1},{name:'image2',maxCount:1},{name:'image3',maxCount:1},{name:'image4',maxCount:1}]),addProduct)//endpoint path and controller function, using fields method we will process multiform field data, we have to add multiple images in the route so we will add one [] and define one object where we will define field name (name) where we will send images, we have added multer middleware that will process the multipart form data
productRouter.post("/remove",adminAuth,removeProduct)//earlier when we used to test this endpoint, these product used to get added in db but now we will get not authorised login again, now we have to provide token we get from /api/user/admin in the headers for the endpoint /api/product/add
productRouter.post("/single",singleProduct)
productRouter.get("/list",listProducts)

// export product router and use it in express server(server.js file)
export default productRouter
