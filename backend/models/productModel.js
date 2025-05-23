//create mongoose model using this we can store data in db

import mongoose from "mongoose";
// schema is a structure used to create data in db
const productSchema=new mongoose.Schema({
    name:{type:String, required:true},//mandatory to provide the name, if we don't provide the name, then this data will not be save din db
    description:{type:String, required:true},
    price:{type:Number, required:true},
    image:{type:Array, required:true},//to store multiple images-array
    category:{type:String, required:true},
    subCategory:{type:String, required:true},
    sizes:{type:Array, required:true},
    bestseller:{type:Boolean},
    date:{type:Number, required:true},
})

//using this schema we will create one model
const productModel=mongoose.models.product || mongoose.model("product",productSchema)//name of model=product, when product model is already available, then that product model will be used, else it will create new model using schema

export default productModel
