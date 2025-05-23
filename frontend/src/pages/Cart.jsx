import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from "../components/Title"
import { assets, products } from '../assets/assets'
import CartTotal from '../components/CartTotal'

const Cart = () => {

  const { products, currency, cartItems, updateQuantity, navigate } = useContext(ShopContext)
  //after getting these data we will change these data in array format where we will add cartItems data and products data in 1 array
  const [cartData, setCartData] = useState([])

  useEffect(() => {
    if (products.length > 0) {//then only we will execute these statements
      // logic so that, products data and cartItems data will be combined to create an array and we will store that in cartData state
      const tempData = []
      for (const items in cartItems) {
        for (const item in cartItems[items]) {//we will get cartItems data and their quantity, we will store one data in one object and we will add that in array
          if (cartItems[items][item] > 0) {//quantity is >0, in that case we will add that data in this array
            tempData.push({
              _id: items,//get this product id from items variable used in for loop
              size: item,
              quantity: cartItems[items][item]//quantity of product id for this particular size
            })


          }

        }
      }
      // console.log(tempData);
      setCartData(tempData)
    }

  }, [cartItems, products])//whenever cartItems is updated, then this function will be executed
  // whenever we are reloading this webpage, then initially product is not loading, before loading this data, it is executing this function, to solve this in dependancy array we will add products
  return (// after this we will use the above data to display multiple products on cartPage
    <div className='border-t pt-14'>
      <div className="text-2xl mb-3">
        <Title text1={'YOUR'} text2={'CART'} />
      </div>
      <div>
        {
          
          cartData.map((item, index) => {
            //we will first find id and using that we will find product from product data, using that we will store that in a variable
            const productData = products.find((product) => product._id === item._id)
            return (
              <div key={index} className='py-4 border-t border-b text-gray-700 grid grid-cols-[4fr_0.5fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-4' >
                <div className='flex items-start gap-6'>
                  <img className='w-16 sm:w-20' src={productData.image[0]} alt="" />
                  <div>
                    <p className='text-xs sm:text-lg font-medium'>{productData.name}</p>

                    <div className='flex items-center gap-5 mt-2'>
                      <p>{currency}{productData.price}</p>
                      <p className='px-2 sm:px-3 sm:py-1 border bg-slate-50'>{item.size}</p>
                    </div>
                  </div>
                </div>
                {/* we will use an event so we will get value of input field, add logic so that if our input field value is empty or 0, in that case we will not execute updateQuantity function */}
                <input onChange={(e) => e.target.value === '' || e.target.value === '0' ? null : updateQuantity(item._id, item.size, Number(e.target.value))} className='border max-w-10 sm:max-w-20 px-1 sm:px-2 py-1' type="number" min={1} defaultValue={item.quantity} />
                {/* functionality so that when we click on bin icon, we will delete that data, removing item form cartData */}
                {/* we need quantity in number format but in input we are getting it in string format */}
                <img onClick={() => updateQuantity(item._id, item.size, 0)} className='w-4 mr-4 sm:w-5 cursor-pointer' src={assets.bin_icon} alt="" />
              </div>
            )
          })
        }
      </div>
      <div className='flex justify-end my-20'>
        <div className='w-full sm:w-[450px]'>
          <CartTotal />
          <div className="w-full text-end">
            {/* when we click on this we will be navigated to place order page */}
            <button onClick={() => navigate('/place-order')} className='bg-black text-white text-sm my-8 px-8 py-3'>PROCEED TO CHECKOUT</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart