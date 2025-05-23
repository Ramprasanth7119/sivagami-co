import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from '../components/Title'
import axios from 'axios'

const Orders = () => {

  const {backendUrl,token,currency}=useContext(ShopContext)//using backend url and token we will fetch orders and store them in state variable

  const [orderData,setOrderData]=useState([])//fetch user's order and store them in this state variable

  const loadOrderData=async(req,res)=>{
    try {
      if (!token) {//if token is not available
        return null//terminate function here
      }//if token is available we will fetch order details
      //do api call
      const response=await axios.post(backendUrl + '/api/order/userorders',{},{headers:{token}})//concat endpoint of user order api, in body we don't have to send anything so add {}, send token in headers {}
      // console.log(response.data);//display this order details in our website, instead of displaying single order, we will display all these orders on orders page
      // to display items, we will store different items in one array and we will add those items in one order data
      if (response.data.success) {
        const allOrdersItem=[]//create a variable called allOrdersItem
        response.data.orders.map((order)=>{//pass individual order
          order.items.map((item)=>{//individual item, in this item, add some properties like status, payment, payment method and date we will get from order object
            item['status']=order.status
            item['payment']=order.payment
            item['paymentMethod']=order.paymentMethod
            item['date']=order.date
            // now save the item in the array
            allOrdersItem.push(item)//item we will get from map
          })
        })
        // console.log(allOrdersItem);
        setOrderData(allOrdersItem.reverse())//reverse=>so that latest order will be displayed on the top
        
      }
      
    } catch (error) {
      
    }
  }

  // run this function whenever our page gets loaded
  useEffect(()=>{
    loadOrderData()
  },[token])//whenever token will be updated it will run this function
  return (
    <div className='border-t pt-16'>
        <div className="text-2xl">
          <Title text1={'MY'} text2={'ORDERS'} />
        </div>

{/* 4 products from orders data and display that as orders */}
        <div>
          {
            orderData.map((item,index)=>(//use orderData instead of products
              <div key={index} className='py-4 border-t border-b text-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
                <div className='flex items-start gap-6 text-sm'>
                  {/* now display products image and products other data */}
                  <img className='w-16 sm:w-20' src={item.image[0]} alt="" />
                  <div>
                    <p className='sm:text-base font-medium'>{item.name}</p>
                    <div className='flex items-center gap-3 mt-1 text-base text-gray-700'>
                      <p>{currency}{item.price}</p>
                      <p>Quantity: {item.quantity}</p>
                      <p>Size: {item.size}</p>
                    </div>
                    <p className='mt-1'>Date : <span className='text-gray-400'>{new Date(item.date).toDateString()}</span></p>
                    <p className='mt-1'>Payment : <span className='text-gray-400'>{item.paymentMethod}</span></p>
                   
                  </div>
                </div>
                <div className="md:w-1/2 flex justify-between">
                  <div className="flex items-center gap-2">
                    <p className='min-w-2 h-2 rounded-full bg-green-500'></p>
                    <p className='text-sm md:text-base'>{item.status}</p>
                  </div>
                  {/* whenever we will change status, and we click on the button the order status will be updated, we can update order status from our admin panel */}
                  <button onClick={loadOrderData} className='border px-4 py-2 text-sm font-medium rounded-sm'>Track Order</button>
                </div>
              </div>
            ))
          }
        </div>
    </div>
  )
}
//when we will create logic for order, then we will use this format to display actual order data


export default Orders