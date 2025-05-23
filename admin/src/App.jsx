// using axios, we will make api call
//using this react-router-dom we will create routes
//using react-toastify, we will display toast notification
//we will fix this port in react project, so that when we run this project in any order port number will be same, right now backend is running at port 4000 and frontend is running on port 5173 amd admin panel is running at 5174, so that when we stop project, first we will start the admin panel at 5173 and frontend at 5173, so to prevent that we will go to vite.config file
//
import React, { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import { Routes, Route } from 'react-router-dom'
import Add from "./pages/Add"
import List from "./pages/List"
import Orders from "./pages/Orders"
import Login from './components/Login'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'

//now we will make an api call, before making an api call, we will go to app.jsx and before this function we will create variables
export const backendUrl="https://sivagami-co-backend.onrender.com/"
// now we will set up routes using the 3 pages we have created here
//now we have to create functionality for logout button
//declare the currency here
export const currency='Rs.'
const App = () => {
  //logic so that whenever we are not authenticated then login page will be displayed
  // check if token is available in localstorage, in that case we will provide that token in token state variable
  // whenever the state variable is initialized, it will check localstorage and if token is available in localstorage, then it will store token in state variable, if token is not available in localstorage, then it will store ''
  const [token,setToken]=useState(localStorage.getItem('token')?localStorage.getItem('token'):'')//using this token state we will use ternary operator, when token is available, then this component will be displayed, when token is not available, then login component will be displayed, if we add something instead of empty string, this admin panel is displayed, after we login using correct credential, we will save token in token state
  //here in token state we have one token, so we will send this token in api, then only we can authenticate the request
  // if we reload the webpage, we will be logged out automatically, to solve this problem, we will use localstorage
  useEffect(()=>{
    localStorage.setItem('token', token)//provide key name token and add token
  },[token])//whenever this token will be updated, this function will be executed and we will store this token in the localstorage
  return (
    <div className='bg-gray-50 min-h-screen'>
    <ToastContainer />
    {token === ""//if token is not available, then display Login component
    ?
    
    <Login setToken={setToken} />//pass setToken setter function as props in Login component, destructure it in Login.jsx file
    ://else display this component
    <>
    
    <Navbar setToken={setToken} />
    <hr />
    <div className="flex w-full">
      <Sidebar />
      <div className="w-[70%] mx-auto ml-[max(5vw,25px)] my-8 text-gray-600 text-base">
      <Routes>
      {/* pass props =token , whenever we will make api call for product add, kust and orders, we have to provide this token */}
        <Route path='/add' element={<Add token={token} />} />
        <Route path='/list' element={<List token={token} />} />
        <Route path='/orders' element={<Orders token={token} />} />
      </Routes>
      </div> 
    </div>  
    </>
    }
    
     
      
    </div>
  )
}

export default App
