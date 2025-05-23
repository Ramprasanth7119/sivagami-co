//in assets.js in the products, where ever we have added bestseller:true we will display only those products in the best seller section(component)

import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title'
import ProductItem from './ProductItem'

const BestSeller = () => {

//we will get all products data using context api
const {products}=useContext(ShopContext)
//from the above data we will get those data whose bestseller property is true
const [bestSeller, setBestSeller]=useState([])

//now we have to find bestseller products from products data and store it in bestSeller state

useEffect(()=>{
    const bestProduct=products.filter((item)=>(item.bestseller)) //filtering individual items, checks if item.bestseller is true and returns only those using filter method and it will save that product in the bestProduct variable
    setBestSeller(bestProduct.slice(0,5))//display only 5 products
},[products])//we have to execute this useEffect whenever the products get updated, after this we will get the bestSeller products in the bestSeller state, this function will be executed and it will display bestseller products
// },[])
// whenever the products will be updated, then this function will be executed and it will display the best seller products


  return (
    <div className='my-10'>
        <div className='text-center text-3xl py-8'>
            <Title text1={'BEST'} text2={'SELLERS'} />
            <p className='w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600'>
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Natus soluta magni sit enim, ut nobis ab non obcaecati unde eum asperiores, aperiam repellat deserunt animi illo alias debitis id molestias.
            </p>
        </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
            {/* use bestSeller state here */}
            {bestSeller.map((item,index)=>(
              <ProductItem key={index} id={item._id} name={item.name} image={item.image} price={item.price} /> //adding props to ProductItem component
            ))}
          </div>
    </div>
  )
}

export default BestSeller