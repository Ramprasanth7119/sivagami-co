import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from "./Title"
import ProductItem from './ProductItem'

const RelatedProducts = ({category, subCategory}) => {//here we have opened product page, so in related product category, we will provide this particular product category and subcategory, using this we will display related products
    const {products}=useContext(ShopContext)
    const [related, setRelated]=useState([])

    useEffect(()=>{
        //logic so that we can filter the product using category and subcategory
        if (products.length>0) {//if it is less than 0, then we will not display any related product
            //first create copy of all products using below line
            let productsCopy=products.slice()

            productsCopy=productsCopy.filter((item)=>category===item.category)//pass individual item and return category===item.category, if category we are getting from props is matching with item.category, then we will keep that product, if they are not matching then we will remove other products
            productsCopy=productsCopy.filter((item)=>subCategory===item.subCategory)//pass individual item and check subcategory===item.subcategory, if subcategory we are getting from props is matching with item.subcategory, then we will keep that product, if they are not matching then we will remove other products
            // console.log(productsCopy.slice(0,5));//display only 5 products
            setRelated(productsCopy.slice(0,5))//we will call setRelated function so that this product data will be stored in this related state

            
          }
    },[products])//when ever product data will be updated, then this function will be executed
  return (
    //we will use this data to map the product here
    <div className='my-24'>
      <div className="text-center text-3xl py-2">
        <Title text1={'RELATED'} text2={'PRODUCTS'} />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
        {related.map((item,index)=>(
          <ProductItem key={index} id={item._id} name={item.name} price={item.price} image={item.image} />
        ))}
      </div>
    </div>
  )
}

export default RelatedProducts