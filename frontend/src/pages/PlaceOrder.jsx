import React, { useContext, useState } from 'react'
import Title from '../components/Title'
import CartTotal from '../components/CartTotal'
import { assets } from '../assets/assets'
import { ShopContext } from '../context/ShopContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const PlaceOrder = () => {
   {/* logic so that any payment option, there should be an indicator of green color */}
   const [method, setMethod]=useState('cod')//cod will be selected by default

   const {navigate,backendUrl, token, cartItems,setCartItems, getCartAmount, delivery_fee, products}=useContext(ShopContext)//state variables and functions from context api

  //  integrate this api with our frontend, for this create a state variable, we will link them with input field so that we can update the state variable whenever input field data is getting changed
  const [formData,setFormData]=useState({
    firstName:"",//update whenever input field gets changed
    lastName:"",
    email:"",
    street:"",
    city:"",
    state:"",
    zipcode:"", 
    country:"",
    phone:""
  })

  //to store values in {}, we will create an onchange function
  const onChangeHandler=(event)=>{
    //from event we can find name and value property of input field and we will store this in a variable
    const name=event.target.name//we will get name property of input field and it will be stored in name variable
    const value=event.target.value//to get value of input field


    //to update the object using this name and value we will add
    setFormData(data=>({...data,[name]:value}))//provide prev data, return an object we will add name field with value, we will update the properties 

  }

  // we will use these options to create a function and using that we can execute razor pay payment in our frontend
  //we will take orderdetails and execute razorpay payment
  const initPay=(order)=>{//send order as a parameter in initPay method
    const options={

      //add razor pay key id in env variable in frontend
      key:import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount:order.amount,//we will get this amount from razorpay,
      currency:order.currency,//from order.currency
      name:'Order Payment',
      description:'Order Payment',
      order_id:order.id,//generated from backend
      receipt:order.receipt,
      //call payment integration api in handler function
      handler:async(response)=>{
        //check response
        console.log(response);
        // link verify razor pay api with handler function
        //send orderiD in our backend and there we will verify payment
        try {
          const {data}=await axios.post(backendUrl +'/api/order/verifyRazorpay',response,{headers:{token}})//concat endpoint, we can directly extract data from response, pass response in body and add token in headers, it will call api and it will verify payment made through razorpay
          if (data.success) {//payment is successful and it is verified
            navigate("/orders")
            setCartItems({})//set cart items to empty {}
            
          }

        } catch (error) {
          console.log(error);
          toast.error(error.message)
          
        }
        
      }


    }
    //create one variable 
    const rzp=new window.Razorpay(options)//options created above
    rzp.open()//open razorpay, it will create a popup and it will execute our payment and after executing our payment, it will execute handler function

  }

  const onSubmitHandler=async(event)=>{//function for the form, add event in parameter
    event.preventDefault()//to prevent reloading webpage on submitting the form
    //logic so that whever we place order using cod order will be palced
    try {
        let orderItems=[]
        // in this array we will add all products from our cartItems
        for(const items in cartItems){
          for(const item in cartItems[items]){
             if (cartItems[items][item]>0) {//if cartitems[items][item]>0=>product is added in cart and quantity is >0, we have to user product id to find the product and using product data we will add size and quantity and add it in this array as an object
              const itemInfo=structuredClone(products.find(product=>product._id===items))//using this we can create one copy of any object in different variable, pass individual product, check if individual product id =items, in that case we will get that product data in variable(itemInfo)
              if (itemInfo) {//if iteminfo is available, in product data we will add size and quantity
                itemInfo.size=item
                itemInfo.quantity=cartItems[items][item]//to get product quantity
                //add itemInfo object in array
                orderItems.push(itemInfo)

                
              }

             }
          }
        }

        //check if logic is working or not
        // console.log(orderItems);
        // to create order data
        let orderData={
          address:formData,//add form data
          items:orderItems,//created above using the variable and for loop
          amount:getCartAmount()+delivery_fee
        }//using this our order data will be created, using this we can place the order

        //switch case to choose different payment methods
        switch(method){
          //api calls for cod order
          case "cod":
          const response=await axios.post(backendUrl + '/api/order/place',orderData,{headers:{token}})//make an api call, concat api endpoint for cod, provide orderData, add token in headers
          // console.log(response.data);
          
          if (response.data.success) {//when this is true, cart items will be set as empty object
            setCartItems({})//order will be placed and we are clearing cart data using {}
            navigate('/orders')//navigate users on orders page
          }else{//order is not placed
            toast.error(response.data.message)
          }
          
          break
          // case 'stripe':
          //   //add api call to stripe endpoint
          //   const responseStripe=await axios.post(backendUrl +'/api/order/stripe',orderData,{headers:{token}})//concat api endpoint, send orderdata, created above switch method above, add headers and token in {}
          //   if (responseStripe.data.success) {//if it is true, it means we will get session url
          //     const {session_url}=responseStripe.data//extract session url from responseStripe.data property, on session url send users
          //     window.location.replace(session_url)
          //   }else{
          //     toast.error(responseStripe.data.message)
          //   }
          //   break

            case 'razorpay':
             //call razorpay api
             const responseRazorpay=await axios.post(backendUrl + '/api/order/razorpay',orderData,{headers:{token}})//for api call, concat endpoint , send orderdata in body , add token in headers, we will get one response
             if (responseRazorpay.data.success) {//we will get order data in response
              // console.log(responseRazorpay.data.order);
              initPay(responseRazorpay.data.order)
              
              
             }
            
            break

          default:
            break;
        }
        
    } catch (error) {
      console.log(error);
      toast.error(error.message)
    }
  }
  // link form data and onchange handler with each input field, convert div to a form tag, so that we can add required property in input field
  return (
    // link function with form tag
    <form onSubmit={onSubmitHandler} className='flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t'>
    {/* left side  */}
      <div className="flex flex-col gap-4 w-full sm:max-w-[480px]">
        <div className="text-xl sm:text-2xl my-3">
          <Title text1={'DELIVERY'} text2={'INFORMATION'} />
        </div>
        {/* now we will create some input fields where user can input their delivery information like name, phone number and address */}
        <div className="flex gap-3">
          <input required onChange={onChangeHandler} name='firstName' value={formData.firstName} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' placeholder='First name' type="text" />
          <input required onChange={onChangeHandler} name='lastName' value={formData.lastName} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' placeholder='Last name' type="text" />
        </div>
        <input required onChange={onChangeHandler} name='email' value={formData.email} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' placeholder='Email address' type="email" />
        <input required onChange={onChangeHandler} name='street' value={formData.street} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' placeholder='Street' type="text" />
        <div className="flex gap-3">
          <input required onChange={onChangeHandler} name='city' value={formData.city} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' placeholder='City' type="text" />
          <input required onChange={onChangeHandler} name='state' value={formData.state} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' placeholder='State' type="text" />
        </div>
        <div className="flex gap-3">
          <input required onChange={onChangeHandler} name='zipcode' value={formData.zipcode} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' placeholder='Zipcode' type="number" />
          <input required onChange={onChangeHandler} name='country' value={formData.country} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' placeholder='Country' type="text" />
        </div>
        <input required onChange={onChangeHandler} name='phone' value={formData.phone} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' placeholder='Phone' type="number" />
      </div>
      {/* all input fields are required */}
      {/* Right Side */}
      <div className="mt-8">
        <div className="mt-8 min-w-80">
        {/* using this we can display total amount on placeorder page */}
          <CartTotal />
        </div>
        <div className="mt-12">
          <Title text1={'PAYMENT'} text2={'METHOD'} />
          {/* Payment Method Selection */}
          <div className="flex gap-3 flex-col lg:flex-row">
          {/* <div onClick={()=>setMethod('stripe')} className="flex items-center gap-3 border p-2 px-3 cursor-pointer">
            <p className={`min-w-3.5 h-3.5 border rounded-full ${method==='stripe'?'bg-green-400':''}`}></p>
            <img className='h-5 mx-4' src={assets.stripe_logo} alt="" />
          </div> */}
          <div onClick={()=>setMethod('razorpay')} className="flex items-center gap-3 border p-2 px-3 cursor-pointer">
          {/* when we select this option p will be green else it will be transparent and we will add the border, for that we will use dynamic classname  */}
           {/* if method is razorpay, then we will provide green background for razorpay method else we will keep it blank */}
            <p className={`min-w-3.5 h-3.5 border rounded-full ${method==='razorpay'?'bg-green-400':''}`}></p>
            <img className='h-5 mx-4' src={assets.razorpay_logo} alt="" />
          </div>
          {/* when we click on these options our state variables will be updated */}
          <div onClick={()=>setMethod('cod')} className="flex items-center gap-3 border p-2 px-3 cursor-pointer">
          {/* when we select this option p will be green else it will be transparent and we will add the border, for that we will use dynamic classname  */}
           {/* if method is cod, then we will provide green background for cod method else we will keep it blank, by default cod will be selected */}
            <p className={`min-w-3.5 h-3.5 border rounded-full ${method==='cod'?'bg-green-400':''}`}></p>
            <p className='text-gray-500 text-sm font-medium mx-4'>CASH ON DELIVERY</p>
           
          </div>
          </div>

          {/* when we will click on the button we will be redirected to orders page */}
          <div className="w-full text-end mt-8">
            <button type='submit' className='bg-black text-white px-16 py-3 text-sm'>PLACE ORDER</button>
          </div>
        </div>
      </div>
    </form>
  )
}

export default PlaceOrder