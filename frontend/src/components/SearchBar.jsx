import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import { assets } from '../assets/assets'
import { useLocation } from 'react-router-dom'

const SearchBar = () => {

    const {search, setSearch, showSearch, setShowSearch}=useContext(ShopContext)
    const [visible,setVisible]=useState(false)
     //adding logic so that search bar will be visible only in the collections page, it is not displayed in other pages
    const location=useLocation()//using useLocation, we can get the path of the url

   useEffect(()=>{
    // console.log(location.pathname)
    if (location.pathname.includes('collection')) {
        //if this condition is true, then we will make this visible state true
        setVisible(true)
    }
    else{
        setVisible(false)
    }
   },[location])

    //when showsearch will be true, then only we will return the below div, else we will return null
  return showSearch && visible?(//if both state are true, only then search bar will be visible else it will be hidden
    <div className='border-t border-b bg-gray-50 text-center'>
        <div className='inline-flex items-center justify-center border border-gray-400 px-5 py-2 my-5 mx-3 rounded-full w-3/4 sm:w-1/2'>
        {/* we will save these input field data in the search state that we have created in context file */}
            <input value={search} onChange={(e)=>setSearch(e.target.value)} className='flex-1 outlet-none bg-imherit text-sm' type="text" placeholder='Search' />
            <img className='w-4' src={assets.search_icon} alt="" />
        </div>
        <img onClick={()=>setShowSearch(false)} className='inline w-3 cursor-pointer' src={assets.cross_icon} alt="" />
    </div>
  ):null
}

export default SearchBar