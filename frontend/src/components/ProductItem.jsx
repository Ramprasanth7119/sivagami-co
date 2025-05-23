import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import {Link} from "react-router-dom"

const ProductItem = ({id,image,name,price}) => {

     //get currency value from the context
     const {currency}=useContext(ShopContext) 
  return (
    //if any one clicks on product item, it will open the product page
    <Link className='text-gray-700 cursor-pointer' to={`/product/${id}`}>
        <div className='overflow-hidden'>
        {/* 1st image from index array */}
            <img className='hover:scale-110 transistion ease-in-out' src={image[0]} alt="" />
        </div>
        {/* adding product name */}
        <p className='pt-3 pb-1 text-sm'>{name}</p>
        <p className='text-sm font-medium'>{currency}{price}</p>
        {/* using the above component, we will display multiple products in the latestCollection component */}
    </Link>
  )
}

export default ProductItem