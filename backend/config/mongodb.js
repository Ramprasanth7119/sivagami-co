import mongoose from "mongoose";

const connectDB=async()=>{
    //logic using this we can connect mongoose package from mongodb atlas server
    mongoose.connection.on('connected',()=>{//add event name that is connected, whenever mongodb connection will be established then this function will be executed
        console.log('DB Connected');//we will get this message when mongodb connection is established
        
    })//whenever we will execute this function, then mongodb db will be connected to project
    await mongoose.connect(`${process.env.MONGODB_URI}/e-commerce`)//provide mongodb uri, in the cluster we have to create a db for this project, project name is e-commerce
}

export default connectDB