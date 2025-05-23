{/* now we will add authentication in admin panel, to add authentication in admin panel we will create new component in components folder */}
//whenever we are not authenticated then login page will be displayed, if we are authenticated, then we will display other UI

import React, { useState } from 'react'
import axios from "axios"
import { backendUrl } from '../App'
import { toast } from 'react-toastify'

const Login = ({setToken}) => {//destructured from app component(passed as prop in Login.jsx in app component)
    const [email,setEmail]=useState("")
    const [password,setPassword]=useState("")

    const onSubmitHandler =async(e)=>{
        try {
            e.preventDefault()//to prevent reloading of the webpage
          
            
            const response =await axios.post(backendUrl + '/api/user/admin',{email,password})//add end point, now send email and password which will be added in req.body
            // console.log(response);//now we have a response containing data with success true and one token, we have used correct email and password provided in .env in the backend
            //now we will store this token in token state
            if (response.data.success) {//it means our authentication is successful and we are getting one token, we have to save token in state variable we have created in app component
                setToken(response.data.token)
            }
            else{//if response.data is false, we will get one message which we will display in notification
                toast.error(response.data.message)
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message)
            
        }
    }
  return (
    <div className='min-h-screen flex items-center justify-center w-full'>
    {/* border radius=rounded-lg */}
        <div className='bg-white shadow-md rounded-lg px-8 py-6 max-w-md'>
            <h1 className='text-2xl font-bold mb-4'>Admin Panel</h1>
            {/* link the function with our form */}
            <form onSubmit={onSubmitHandler}>
                <div className='mb-3 min-w-72'>
                    <p className='text-sm font-medium text-gray-700 mb-2'>Email Address</p>
                    {/* link state variables with input fields, so that when we add any changes in input fields it will update email and password in state variable, we will also add value property */}
                    <input onChange={(e)=>setEmail(e.target.value)} value={email} className='rounded-md w-full px-3 py-2 border border-gray-300 outline-none' type="email" placeholder='your@email.com' required />
                </div>
                <div className='mb-3 min-w-72'>
                    <p className='text-sm font-medium text-gray-700 mb-2'>Password</p>
                    <input onChange={(e)=>setPassword(e.target.value)} value={password} className='rounded-md w-full px-3 py-2 border border-gray-300 outline-none' type="password" placeholder='Enter your password' required />
                </div>
                <button className='mt-2 w-full py-2 px-4 rounded-md text-white bg-black' type='submit'>Login</button>
            </form>
        </div>
    </div>
  )
}

export default Login