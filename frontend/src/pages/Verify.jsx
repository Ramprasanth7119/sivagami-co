// use this to verify the payment
import React, { useContext, useEffect } from 'react'
import { ShopContext } from '../context/ShopContext'
import { useSearchParams } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'

const Verify = () => {
    // logic to verify payment
    const {navigate,token,setCartItems,backendUrl}=useContext(ShopContext)
    //from parameters we have to get params
    const [searchParams,setSearchParams]=useSearchParams()//extract success property and orderid from params
    const success=searchParams.get('success')//key name=success, we will get true or false
    const orderId=searchParams.get('orderId')

    const verifyPayment=async()=>{
        try {
            if (!token) {//if token is not available
                return null//stop execution of function
                
            }//if token is available
            //call api to verify stripe
            const response=await axios.post(backendUrl +'/api/order/verifyStripe',{success,orderId},{headers:{token}})//concat endpoint address, add success and orderid in {} and add token in headers
            if (response.data.success) {//check response, means we have verified the payment
                setCartItems({})//cart data will be cleared
                navigate('/orders')//send users on orders page
                
            }//payment is failed
            else{
                navigate("/cart")//send users on cart page so user can try to make payment again
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message)
        }
    }

    useEffect(()=>{
        verifyPayment()
    },[token])//execute this function whenever we will open this page
  return (
    <div>

    </div>
  )
}

export default Verify