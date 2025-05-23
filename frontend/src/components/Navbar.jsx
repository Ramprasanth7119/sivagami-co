import React, { useContext, useState } from 'react'
import {assets} from "../assets/assets"
import {Link, NavLink} from "react-router-dom"
import { ShopContext } from '../context/ShopContext'

const Navbar = () => {

  const [visible,setVisible]=useState(false)
  const {setShowSearch, getCartCount,navigate, token, setToken, setCartItems}=useContext(ShopContext)

  {/* now we will add logout functionality */}
  const logout=()=>{
    navigate("/login")//navigate user on login page
    localStorage.removeItem("token")//remove token from localstorage, key name="token"
    setToken('')//clear state variable
    setCartItems({})//when we are loggedout we will clear cart item
   
  }

  return (
    <div className="flex items-center justify-between py-5 font-medium">
    {/* here link is used to redirect to home page when we click on the logo */}
      <Link to="/"><img src={assets.logo} className='w-36 cursor-pointer' alt="" /></Link>

      {/* menu will be hidden but for small and above screen it will be displayed */}
      <ul className='hidden sm:flex gap-5 text-sm text-gray-700'>
        <NavLink to="/" className="flex flex-col items-center gap-1">
          <p>HOME</p>
          <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden'/>

        </NavLink>
        <NavLink to="/collection" className="flex flex-col items-center gap-1">
          <p>COLLECTION</p>
          <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden'/>

        </NavLink>
        <NavLink to="/about" className="flex flex-col items-center gap-1">
          <p>ABOUT</p>
          <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden'/>

        </NavLink>
        <NavLink to="/contact" className="flex flex-col items-center gap-1">
          <p>CONTACT</p>
          <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden'/>

        </NavLink>
      </ul>

    <div className='flex items-center gap-6'>
    {/* adding logic so that when we click on the search bar icon, then the search bar will be displayed else it will remain hidden */}
    
      <img onClick={()=>setShowSearch(true)} src={assets.search_icon} className='w-5 cursor-pointer' alt="" />
      <div className="group relative">
      {/* //we have to add link on profile icon, when we click here in profile icon, it should open login page */}
      {/* add functiionality so that when we are loggedout, still we are getting myprofile, orders and logout, we have to hide it, it will be visible whenever we are logged in */}
      {/* if token is avialable, then return null, it token is not available, then we will navigate to login path */}
      {/* when we are logged in and we click on profile icon it will not execute the navigate statement mentioned below */}
       <img onClick={()=>token ? null : navigate('/login')} className='w-5 cursor-pointer' src={assets.profile_icon} alt="" />
       {/* Drop down Menu, we will display the below div whenever we are logged in */}
       {/* whenever token is available, only then div will be displayed */}
       {token &&
         <div className="group-hover:block hidden absolute dropdown-menu right-0 pt-4">
          <div className="flex flex-col gap-2 w-36 py-3 px-5 bg-slate-100 text-gray-500 rounded">
            <p className='cursor-pointer hover:text-black' onClick={() => navigate("/profile")}>My Profile</p>
            {/* to redirect us on the orders page */}
            <p onClick={()=>navigate('/orders')} className='cursor-pointer hover:text-black'>Orders</p>
            {/* add logout function in the below tag */}
            <p onClick={logout} className='cursor-pointer hover:text-black'>Logout</p>
          </div>
        </div>}
      </div>
      <Link to="/cart" className='relative'> 
        <img src={assets.cart_icon} className='w-5 min-w-5' alt="" />
        <p className='absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px]'>{getCartCount()}</p>
      </Link>

      {/* side bar menu for home screen */}
      {/* menu is hidden in small screen  */}
      {/* whenever we click on menu icon, visible state will be true */}
      <img onClick={()=>setVisible(true)} src={assets.menu_icon} className='w-5 cursor-pointer sm:hidden' alt="" />
    </div>
    {/* Sidebar menu for small screen */}
    {/* dynamic classname is where we use the state variable but whenever the state changes, classname is changed */}
    <div className={`absolute top-0 right-0 buttom-0 overflow-hidden bg-white transition-all ${visible?'w-full':'w-0'}`}>
      <div className="flex flex-col text-gray-600">
      {/* onclick below is used to close the side bar menu whenever we click on the div or its items */}
        <div onClick={()=>setVisible(false)} className="flex items-center gap-4 p-3 cursor-pointer">
          <img className='h-4 rotate-180' src={assets.dropdown_icon} alt="" />
          <p>Back</p>
        </div>

        {/* onclick below is used to close the sidebar menu when ever we click on any of the navlinks */}
        <NavLink onClick={()=>setVisible(false)} className="py-2 pl-6 border" to="/">HOME</NavLink>
        <NavLink onClick={()=>setVisible(false)} className="py-2 pl-6 border" to="/collection">COLLECTION</NavLink>
        <NavLink onClick={()=>setVisible(false)} className="py-2 pl-6 border" to="/about">ABOUT</NavLink>
        <NavLink onClick={()=>setVisible(false)} className="py-2 pl-6 border" to="/contact">CONTACT</NavLink>
      </div>
    </div>
    </div>
  )
}

export default Navbar

// Components folder is used to create multiple components that we can reuse in the project
//using context, we can manage the logic of ecommerce project 