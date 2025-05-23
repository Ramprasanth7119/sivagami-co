import React, { useState } from 'react'
import { assets } from '../assets/assets'
import axios from "axios"
import { backendUrl } from '../App'
import { toast } from 'react-toastify'

// now we will create ui to add product
const Add = ({token}) => {//we will destructure the token and we will send it as headers in api request
  // now we will create a state variable, in that we will store product data
  //first we will create 4 state variables to store all 4 images
  const [image1,setImage1]=useState(false)
  const [image2,setImage2]=useState(false)
  const [image3,setImage3]=useState(false)
  const [image4,setImage4]=useState(false)

  //state variables to store product name,desc, size, category, subcategory, bestseller and sizes
  const [name,setName]=useState("")
  const [description,setDescription]=useState("")
  const [price,setPrice]=useState("")
  const [category,setCategory]=useState("Men")
  const [subCategory, setSubCategory]=useState("Topwear")
  const [bestseller,setBestseller]=useState(false)//if we want to add a product here, we will make bestSeller to true
  const [sizes,setSizes]=useState([])
  //link the above state variables in the UI


  // for the form tag,we will create onSubmit function, so that when we submit this form, then this function will be executed
  const onSubmitHandler=async(e)=>{//get event
    e.preventDefault()//so that when we submit the form, our webpage will not reload
    try {//create a variable named form Data
      const formData=new FormData()//we will add this form data in body when we will add api call, for that we need to add all images and product details in form data
      formData.append("name",name)//in name field provide name and provide value which we will get from name state
      formData.append("description",description)
      formData.append("price",price)
      formData.append("category",category)
      formData.append("subCategory",subCategory)
      formData.append("bestseller",bestseller)//we have added product details
      formData.append("sizes",JSON.stringify(sizes))//we cannot send array in form data, so to send it we need to convert to string, provide sizes array in JSON.stringify
      //now send images
      image1 && formData.append("image1",image1)
      image2 && formData.append("image2",image2)
      image3 && formData.append("image3",image3)
      image4 && formData.append("image4",image4)//all 4 images will be added in form data, here if we select only 1 image and click on add button, then we don't have to add other images in form data, for this here we will add && operator, here we will check if image1 is available, then we will append this image1 else we will not append this one(if we select 2 image, we wil only add 2 images in form data)

      // send form data using api  on our backend for this we will use axios
      const response=await axios.post(backendUrl + "/api/product/add", formData, {headers:{token}})//to make api call, we need backend URL, to get this we will go to app.jsx file, concat the endpoint and provide form data in body
      // console.log(response.data);//we are trying to login directly, so it will not add product as we have added authentication in our backend to add product, go to app.jsx (line 25)
      //now after clicking on add button, the product will be added on db, our product add feature is perfectly working

      // now we will add logic so that when we add product, we have to clear images and input field in add.jsx
      if (response.data.success) {
        toast.success(response.data.message)
        setName("")//reset it with ""
        setDescription("")
        setImage1(false)
        setImage2(false)
        setImage3(false)
        setImage4(false)
        setPrice("")//so that form will be reset
      }else{//if product is not added
        toast.error(response.data.message)
      }
      
    } catch (error) {
      console.log(error);
      toast.error(error.message)
      
    }

  }


  return (
    // link the function with form tag
    <form onSubmit={onSubmitHandler} className='flex flex-col w-full items-start gap-3'>
      <div>
        <p className='mb-2'>Upload Image</p>

        <div className='flex gap-2'>
        {/* htmlFor is id from input's id field */}
          <label htmlFor="image1">
          {/* when we select any image, then that image will be displayed instead of upload icon */}
          {/* if image1 is not available, in that case we will use assets.upload_area, if it is available, then we will create one url of that image and use that image in url */}
            <img className='w-20 cursor-pointer' src={!image1 ? assets.upload_area:URL.createObjectURL(image1)} alt="" />
            <input onChange={(e)=>setImage1(e.target.files[0])} type="file" id='image1' hidden />
          </label>
          <label htmlFor="image2">
            <img className='w-20 cursor-pointer' src={!image2 ? assets.upload_area:URL.createObjectURL(image2)} alt="" />
            <input onChange={(e)=>setImage2(e.target.files[0])} type="file" id='image2' hidden />
          </label>
          <label htmlFor="image3">
            <img className='w-20 cursor-pointer' src={!image3 ? assets.upload_area:URL.createObjectURL(image3)} alt="" />
            <input onChange={(e)=>setImage3(e.target.files[0])} type="file" id='image3' hidden />
          </label>
          <label htmlFor="image4">
            <img className='w-20 cursor-pointer' src={!image4 ? assets.upload_area:URL.createObjectURL(image4)} alt="" />
            <input onChange={(e)=>setImage4(e.target.files[0])} type="file" id='image4' hidden />
          </label>
        {/* now we have stored those images in state variable and those images are previewed here */}
        {/* now we will convert these input fields and select options to controlled input fields, controlled input fields are those where we will add any changes, it will update value in state variable */}
        </div>
      </div>

      {/* now create multiple input fields to add product data */}
      <div className='w-full'>
        <p className='mb-2'>Product name</p>
        {/* pass event and in setname function we will provide value of input field, to get value we will provide e.target.value, add value property and provide name state */}
        <input onChange={(e)=>setName(e.target.value)} value={name} className='w-full max-w-[500px] px-3 py-2' type="text" placeholder='Type here' required/>
      </div>
      <div className='w-full'>
        <p className='mb-2'>Product description</p>
        <textarea onChange={(e)=>setDescription(e.target.value)} value={description} className='w-full max-w-[500px] px-3 py-2' type="text" placeholder='Write content here' required/>
      </div>

      <div className='flex flex-col sm:flex-row gap-2 w-full sm:gap-8'>
        <div>
          <p className='mb-2'>Product category</p>
          <select onChange={(e)=>setCategory(e.target.value)} className='w-full px-3 py-2'>
          {/* whenever we will select any option, then that option value will be stored in category state */}
            <option value="Men">Men</option>
            <option value="Women">Women</option>
            <option value="Kids">Kids</option>
          </select>
        </div>
        <div>
          <p className='mb-2'>Sub category</p>
          <select onChange={(e)=>setSubCategory(e.target.value)} className='w-full px-3 py-2'>
            <option value="Topwear">Topwear</option>
            <option value="Bottomwear">Bottomwear</option>
            <option value="Winterwear">Winterwear</option>
          </select>
        </div>


        <div>
          <p className='mb-2'>Product Price</p>
          <input onChange={(e)=>setPrice(e.target.value)} value={price} className='w-full px-3 py-2 sm:w-[120px]' type="Number" placeholder='25' />
        </div>
      </div>

      <div>
      {/* if we select sizes, it will be stored in one array */}
        <p className='mb-2'>Product Sizes</p>
        <div className='flex gap-3'>
        {/* call set sizes, here first we will get prev data and we will check if in our prev array, this S size is already included, in that case it will remove that character from the array, size will be removed when we select this div, if size is not available in [], then it will add this size in array */}
        {/* in filter function, we will get individual item and check if our item is not = S, in that case we will filter that, if size is not included, we will add it, here in this array if string is available, then we will remove it and if it is not available, then we will add it using this spread oprator(...prev) and our size */}
          <div onClick={()=>setSizes(prev=>prev.includes("S") ? prev.filter(item=>item!=="S"):[...prev,"S"])}> 
          {/* logic to highlight selected size, for this we will add dynamic class name */}
          {/* if we get sizes.includes function to be true we will add different bg color, else different bgcolor */}
            <p className={`${sizes.includes("S") ? 'bg-pink-100' : "bg-slate-200"} px-3 py-1 cursor-pointer`}>S</p>
          </div>
          <div onClick={()=>setSizes(prev=>prev.includes("M") ? prev.filter(item=>item!=="M"):[...prev,"M"])}>
            <p className={`${sizes.includes("M") ? 'bg-pink-100' : "bg-slate-200"} px-3 py-1 cursor-pointer`}>M</p>
          </div>
          <div onClick={()=>setSizes(prev=>prev.includes("L") ? prev.filter(item=>item!=="L"):[...prev,"L"])}>
            <p className={`${sizes.includes("L") ? 'bg-pink-100' : "bg-slate-200"} px-3 py-1 cursor-pointer`}>L</p>
          </div>
          <div onClick={()=>setSizes(prev=>prev.includes("XL") ? prev.filter(item=>item!=="XL"):[...prev,"XL"])}>
            <p className={`${sizes.includes("XL") ? 'bg-pink-100' : "bg-slate-200"} px-3 py-1 cursor-pointer`}>XL</p>
          </div>
          <div onClick={()=>setSizes(prev=>prev.includes("XXL") ? prev.filter(item=>item!=="XXL"):[...prev,"XXL"])}>
            <p className={`${sizes.includes("XXL") ? 'bg-pink-100' : "bg-slate-200"} px-3 py-1 cursor-pointer`}>XXL</p>
          </div>
        </div>
      </div>

      <div className='flex gap-2 mt-2'>
      {/* whenever we will select this checkbox then that product will be added in best seller category */}
      {/* here we will get prev data and we will add !prev, if prev data is true, we will get false else vice versa, if bestseller is true, checked will be true, else it will be unchecked*/}
        <input onChange={()=>setBestseller(prev=>!prev)} checked={bestseller} type="checkbox" id='bestseller' />
        {/* htmlFor=id from above input field */}
        <label className='cursor-pointer' htmlFor="bestseller">Add to bestseller</label>
      </div>

{/* button tag to submit this form */}
      <button type='submit' className='w-28 py-3 mt-4 bg-black text-white'>ADD</button>
    </form>
  )
}

export default Add
// now we will set up routes using the 3 pages we have created here