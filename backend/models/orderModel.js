import mongoose from "mongoose"
// import { type } from "os"

const orderSchema=new mongoose.Schema({
    userId:{type:String, required:true},//we will store user id of user who has placed order
    items:{type:Array, required:true},//store product data that we have ordered
    amount:{type:Number, required:true},
    address:{type:Object, required:true},
    status:{type:String, required:true, default:"Order Placed"},
    paymentMethod:{type:String, required:true},
    payment:{type:Boolean, required:true, default:false},//whenever new order will be places, by default will be false, whenever we will add payment gateway and make payment online, then we will make payment status true, make payment true whenever the user makes payment online(stripe or razorpay)
    date:{type:Number,required:true}//date whenever order will be places
    
})

const orderModel=mongoose.models.order || mongoose.model('order',orderSchema)

export default orderModel