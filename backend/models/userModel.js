import mongoose from "mongoose";

const userSchema=new mongoose.Schema({//define properties of user
    name:{type:String, required:true},
    email:{type:String, required:true, unique:true},//if we have created account with an email id, then it will not create another account with same email id
    password:{type:String, required:true},
    cartData:{type:Object, default:{}},//whenever new user will be created, then their cartData will be empty {}



},{minimize:false})//whenever we will create the cart data, by default we have provided value of {}, so whenever we create user using mongoose, the cartdata will be unavailable because mongoose neglets propery where we have 1 empty object, so if we create one cart data with empty {}, then that data will not be displayed in mongodb, we want to create cart data also when user is created, thats why we have provided minimize property set to false, using that it will create cart data using empty {}

const userModel=mongoose.models.user || mongoose.model("user",userSchema)//it will create user model

export default userModel