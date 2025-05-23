import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import axios from "axios"
import {backendUrl, currency} from "../App"
import {toast} from "react-toastify"
import { assets } from '../assets/assets'

//get all order details in admin panel, whenever we will hit this endpoint, then this controller function will be executed, and we have added admin auth middleware, first we have to send token of admin, then only we will receive all orders data
const Orders = ({token}) => {//get token from props and with that we will create one state variable with name orders

  //get all orders data and store them in one state variable
  const [orders,setOrders]=useState([])
  const fetchAllOrders=async()=>{
    if (!token) {//if token is not available
      return null//terminate this function
      
    }//if token is available
    try {
      const response=await axios.post(backendUrl + '/api/order/list',{},{headers:{token}})//call api, concat endpoint of api, dont have to send anything in our body so pass {}, and in headers, pass an object with token
      // console.log(response.data);
      if (response.data.success) {//it means we will get order details
        setOrders(response.data.orders.reverse())//new order is displayed at top and old ones in the bottom
      }else{////it means we are not  getting order details
        toast.error(response.data.message)
      }
      
    } catch (error) {
      toast.error(error.message)
    }
  }//now orders will be stored in order state variable, we will use order state to display order in admin panel's order page

  const statusHandler=async(event, orderId)=>{//get event from select tag and orderId whenever we will call this function
    try {
      const response=await axios.post(backendUrl +'/api/order/status',{orderId,status:event.target.value},{headers:{token}})//add logic for call api, concat with endpoin, pass orderid and add status, to get status use event.target.value, after adding these, if we select any option from select tag, than that option will ve added in status property, it is an admin property so we will pass headers, so in headers we will pass token in an object 
      if (response.data.success) {//get response, =>status has been updated
        await fetchAllOrders()//so that it will update status here

        
      }
    } catch (error) {
      console.log(error);
      toast.error(response.data.message)      
    }

  }//link function with select tag

  //call the function whenever our webpage gets loaded
  useEffect(()=>{
    fetchAllOrders()
  },[token])//execute this function whenever our token is updated
  return (
    <div>
      <h3>Order Page</h3>
      <div>
        {
          orders.map((order,index)=>(//pass individual order and index, below div will be displayed on webpage based on number of orders 
          
            <div className='grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr] lg:grid-cols-[0.5fr_2fr_1fr_1fr_1fr] gap-3 items-start border-2 border-gray-200 p-5 md:p-8 my-3 md:my-4 text-xs sm:text-sm text-gray-700' key={index}>
              <img className='w-12' src={assets.parcel_icon} alt="" />
              <div>
              <div>
                {order.items.map((item,index)=>{//pass individual item and index
                  if(index===order.items.length-1){//it is the last item, in last item we will display product name in different format, and we will display other items in different format
                  return <p className='py-0.5' key={index}>{item.name} x {item.quantity} <span>{item.size}</span></p>//add name and quantity, and size of the product
                  }else{
                    return <p className='py-0.5' key={index}>{item.name} x {item.quantity} <span>{item.size}</span> ,</p>//no , for last product
                  }
                })}
              </div>
              <p className='mt-3 mb-2 font-medium'>{order.address.firstName + " "+order.address.lastName}</p>
              <div>
              {/* full name and address */}
                <p>{order.address.street+ ","}</p>
                <p>{order.address.city+ ", "+order.address.state+", "+order.address.country+", "+order.address.zipcode}</p>
              </div>
              <p>{order.address.phone}</p>
            </div>
            {/* order details like payment method, date, etc */}
            <div>
                <p className='text-sm sm:text-[15px]'>Items : {order.items.length}</p>
                <p className='mt-3'>Method : {order.paymentMethod}</p>
                {/* if order.payment is true, then we will add Done, else pending */}
                <p>Payment : { order.payment ? "Done":'Pending' }</p>
                {/* new key word and date constructor */}
                <p>Date : {new Date(order.date).toLocaleDateString()}</p>
            </div>
            <p className='text-sm sm:text-[15px]'>{currency}{order.amount}</p>
            {/* create functionality so that when we change status of any order, then that status will be saved in db and when user will click on track button, then it will refresh order status in this user's myOrders page */}
            {/* after adding value, it will display current status */}
            {/* link function with select tag, pass and take select tag event and in the function we have to provide event(we will get from arrow function below) and orderId(to get this add order._id) */}
            <select onChange={(event)=>statusHandler(event,order._id)} value={order.status} className='p-2 font-semibold'>
            {/* add order status here, whenever new order will be placed, status will be order placed */}
            
              <option value="Order Placed">Order Placed</option>
              <option value="Packing">Packing</option>
              <option value="Shipped">Shipped</option>
              <option value="Out for Delivery">Out for Delivery</option>
              <option value="Delivered">Delivered</option>
            </select>
              </div>
          ))
        }
      </div>
    </div>
  )
}

// add logic so that when we update in orders admin panel it will update status in db, create functionality so that when we change status of any order, then that status will be saved in db and when user will click on track button, then it will refresh order status in this user's myOrders page
export default Orders