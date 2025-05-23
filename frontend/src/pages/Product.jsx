//now we will display product page, if we open any product, we can display the product, from product id we can display the product on this page

import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'
import { assets } from '../assets/assets'
import RelatedProducts from '../components/RelatedProducts'

const Product = () => {

  //using this hook, we will get the product id, same text productId as used in Product route's path
  const {productId}=useParams()//it will get product id from the url, the same text of productId is added in the path in route in app.jsx 
  // console.log(productId);
  //using this product id we will display the product from our product db, we will store that particular product in on state variable
  const {products,currency,addToCart}=useContext(ShopContext)
  const [productData, setProductData]=useState(false)
  const [image,setImage]=useState("")//whenever we find any product, we will store the first image in the image state
  const [size,setSize]=useState("")

  const fetchProductData=async()=>{
    products.map((item)=>{//using productId, we will find the particular product and we will save the product in the state variable
      if (item._id===productId) {//it means we have to set that product in product data state
          setProductData(item)
          setImage(item.image[0])//whenever we find any product, we will store the first image in the image state
          // console.log(item);//display 4 sub images on the left side and main image on the right, whenever we click on any small image, it will update the main image
          
          return null//so that it will stop executing this function
      }
    })
  }

useEffect(()=>{
  fetchProductData()
},[productId])//we will run this function when the component is loaded, whenever the product id is updated, we will get the product data and we will store that product data in state variable, to store this product data in state variable, we have to find the product
  
  return productData ?  (//if we are getting the product data
    <div className='border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100'>
    {/*-------------------- Product Data---------------------- */}
      <div className='flex gap-12 sm:gap-12 flex-col sm:flex-row'>
      {/* ----------------Product Images----------------------- */}
      <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row">
        <div className='flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full'>
          {productData.image.map((item,index)=>(//when we click on any other image, that small image will be displayed at the main image position
            <img onClick={()=>setImage(item)} src={item} key={index} className='w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer' alt="" />
          ))}
        </div>
        <div className="w-full sm:w-[80%]">
        {/* image state we have created above where we have added products 1st image */}
          <img className='w-full h-auto' src={image} alt="" />
        </div>
      </div>
      {/* ----------------------Product Info----------------- */}
          <div className="flex-1 ">
            <h1 className='font-medium text-2xl mt-2'>{productData.name}</h1>
            <div className="flex items-center gap-1 mt-2">
              <img className='w-3.5' src={assets.star_icon} alt="" />
              <img className='w-3.5' src={assets.star_icon} alt="" />
              <img className='w-3.5' src={assets.star_icon} alt="" />
              <img className='w-3.5' src={assets.star_icon} alt="" />
              <img className='w-3.5' src={assets.star_dull_icon} alt="" />
              <p className='pl-2'>(122)</p>
            </div>
            {/* currency from useContext */}
            <p className='mt-5 text-3xl font-medium'>{currency}{productData.price}</p>
            <p className='mt-5 text-gray-500 md:w-4/5'>{productData.description}</p>
            <div className="flex flex-col gap-4 my-8">
              <p>Select Size</p>
               {/* use sizes from product data */}
                {/* adding dynamic classname to button tag */}
              <div className="flex gap-2">
               
                {productData.sizes.map((item,index)=>(
                 
                 <button onClick={()=>setSize(item)} className={`border py-2 px-4 bg-gray-100 ${item===size?"border-orange-500":""}`} key={index}>{item}</button>//item we will get from the parameter of map passed above, if item==size, then we will add a class name else it will be ""
                ))}
                {/* if we select any size, selected size will be highlighter and here we will display some border */}
              </div>
            </div>
            {/* we will get size from state varibale we have created above */}
            <button onClick={()=>addToCart(productData._id,size)} className='bg-black text-white px-8 py-3 text-sm active:bg-gray-700'>ADD TO CART</button>
            <hr className='mt-8 sm:w-4/5' />
            <div className="text-sm text-gray-500 mt-5 flex flex-col gap-1">
              <p>100% Original product.</p>
              <p>Cash on delivery is available on this product.</p>
              <p>Easy return and exchange policy within 7 days.</p>
            </div>
          </div>
      </div>
      {/* Description and Review section */}
      <div className="mt-20">
        <div className="flex">
          <b className='border px-5 py-3 text-sm'>Description</b>
          <p className='border px-5 py-3 text-sm'>Reviews (122)</p>
        </div>
        <div className="flex flex-col gap-4 border px-6 py-6 text-sm text-gray-500">
          <p>An e-commerce website is an online platform that facilitates the buying and selling of products or services over the internet. It serves as a virtual marketplace where business and individuals can showcase their products, interact with customers, and conduct transactions without a need for a physical presence. E-commerce websites have gained immense popularity due to their convineance, accessibility and global reach they offer.</p>
          <p>E-commerce websites typically display products or services along with descriptions, images, prices and any available variations(e.g.,sizes, colors).Each product usually has its own dedicated page with relavent information. </p>
        </div>
      </div>

      {/* Display Related Products */}
      <RelatedProducts category={productData.category} subCategory={productData.subCategory} />
    </div>
  ):<div className='opacity-0'></div>//display this if product data is not saved or not found
}

export default Product