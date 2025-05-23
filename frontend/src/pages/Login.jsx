import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const Login = () => {


  // manage our state like login or signup
  const [currentState,setCurrentState]=useState('Login')//set login form by default
  const {token,setToken,navigate,backendUrl}=useContext(ShopContext)

  const [name,setName]=useState("")
  const [email,setEmail]=useState("")
  const [password,setPassword]=useState("")//link state variables with input field

  const onSubmitHandler=async(event)=>{//whenever we will submit the form we will get event from form submission and using that event we can provide prevent default which will prevent webpage from reloading after we submit the form
    event.preventDefault()
    try {
      //before calling api, we will create 3 state variable, where we will store input field values
      if (currentState==="Sign Up") {
        //we will call signup(registration) api
        const response=await axios.post(backendUrl + '/api/user/register',{name,email,password})//concat the endpoint, then pass body where we will pass email,password and name
        // console.log(response.data);//after this we will get this response, check this response
        //now we have to store token in token state variable
        if (response.data.success) {
          setToken(response.data.token)//it will store token in token state variable
          //store same token in localstorage 
          localStorage.setItem("token",response.data.token)//key name="token", also add response.data.token
        }else{
          toast.error(response.data.message)
        }
        //now here we have created api call for signup
      }else{//state is login
        //we will call login api
        const response=await axios.post(backendUrl + '/api/user/login',{email,password})//concat login api endpoint, add an object, in this send an email and password, now we will get a response
        // console.log(response.data);//check the response
        if (response.data.success) {
          setToken(response.data.token)//set token in token state
          localStorage.setItem("token",response.data.token)
        }else{
          toast.error(response.data.message)
        }
        
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message)
      
    }

    
  }

  // now we will add functionality when we click on login and token will be saved in state variable, then we will redirect user on home page
  useEffect(()=>{
    if (token) {//if token is available
      navigate("/")
      
    }//if we reload the webpage, token is removed and now we have come back to the login page, here we have an issue, when we refresh the webpage, it will remove token from the state variable, thats why it is opening login page, now we will add logic so that we will check if localstorage have this token, using that token we will update state variable so that whenever we will refresh this webpage again we will be loggedin(in shopContext.jsx file)
  },[token])//whenever token will be updated, this function will be updated
  return (
    // link the above function in form tag
    <form onSubmit={onSubmitHandler} className='flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800'>
        <div className="inline-flex items-center gap-2 mb-2 mt-10">
        {/* will display signup */}
          <p className='prata-regular text-3xl'>{currentState}</p>
          <hr className='border-none h-[1.5px] w-8 bg-gray-800' />
        </div>
        {/* if we are in login page, hide the input name field, else display it along with 2 other input fields */}
        {currentState==='Login' ? "":<input onChange={(e)=>setName(e.target.value)} value={name} type="text" className='w-full px-3 py-2 border border-gray-800' placeholder='Name' required />}
        <input onChange={(e)=>setEmail(e.target.value)} value={email} type="email" className='w-full px-3 py-2 border border-gray-800' placeholder='Email' required />
        <input onChange={(e)=>setPassword(e.target.value)} value={password} type="password" className='w-full px-3 py-2 border border-gray-800' placeholder='Password' required />
        {/* now if we update input field, it will update value in state variable */}
        <div className='w-full flex justify-between text-sm mt-[-8px]'>
        {/* when we are on login page, then on right side it will display create account else display login here */}
        <p className='cursor-pointer'>Forgot your password?</p>
        {
          currentState==='Login'
          ?
          <p onClick={()=>setCurrentState('Sign Up')} className='cursor-pointer'>Create account</p>
          :
          <p onClick={()=>setCurrentState('Login')} className='cursor-pointer'>Login here</p>
        }
        </div>
        {/* if current state is login then display sign in in button tag else display sign up in button tag  */}
        <button className='bg-black text-white font-light px-8 py-2 mt-4'>{currentState==='Login'?'Sign In':'Sign Up'}</button>
    </form>
  )
}

export default Login