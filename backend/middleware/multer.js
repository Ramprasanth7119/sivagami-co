import multer from "multer"
//create a storage config
const storage=multer.diskStorage({//object where we will define a file name property
    filename:function(req,file,callback){//store a function in the filename
        callback(null,file.originalname)//call cb function and in first parameter we will pass null and in 2nd parameter, we will return our file.originalName
    }
})

//using diskstorage, we will create one upload middleware

const upload=multer({storage})//we will use multer package and here provide our storage created above

export default upload//export upload middleware// use this in productRoute(use in addProduct route because we have to send multiple images that will be passed using multiple middlware, provide the middleware in productRoute)