// config for cloudinary cloud storage where we will store images
// get api key from cloudinary website

import {v2 as cloudinary} from "cloudinary"

const connectCloudinary=async ()=>{
    //config our cloudinary
    cloudinary.config({//provide an object where we will define
        cloud_name:process.env.CLOUDINARY_NAME,
        api_key:process.env.CLOUDINARY_API_KEY,
        api_secret:process.env.CLOUDINARY_SECRET_KEY

    })
}

export default connectCloudinary