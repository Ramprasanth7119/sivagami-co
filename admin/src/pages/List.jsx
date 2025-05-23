import React, { useEffect, useState } from 'react'
import axios from "axios"
import {backendUrl, currency} from "../App"
import { toast } from 'react-toastify'
// display all items added in db, where we will display those in List.jsx page

const List = ({token}) => {
  //get data from api that we have to display here
  const [list,setList]=useState([])

  const fetchList=async()=>{
    // now we will add logic, using that we will get api and get list of all products
    try {
      const response= await axios.get(backendUrl + "/api/product/list")//used get here because we have used get method to create endpoint of productlist, concat the endpoint of api
      // console.log(response.data);//in products we have 6 products that we have added while testing, we will store products array in list state
      if(response.data.success){
        setList(response.data.products)//we will add it whenever response.success is true
      }
      else{//if response.data.success is false
        toast.error(response.data.message)

      }
     
    } catch (error) {
        console.log(error);
        toast.error(error.message)
        
    }//now all products details have been added in this list, using this we can display all products in list component
  }//we will run this function whenever this page is reloaded


  //add functionality so that when we click on X icon, the product will be deleted from db, for that we will have created api that we will call here
  const removeProduct=async(id)=>{//product id that we will get from list.map, whenever this function is executed, we will remove that product from db using this id
    try {
      const response=await axios.post(backendUrl + '/api/product/remove',{id},{headers:{token}})//call api, in body send product id that we will get from parameter id, as this is an admin feature, we need to provide the token here in headers, we will get this token from props
      if (response.data.success) {//it will check if response.data.success is true, then product will be deleted from db
        toast.success(response.data.message)//with this product will be removed, now we have to update the list again
        await fetchList()//call fetchList function
        
      }else{//if response.data.success is false
        toast.error(response.data.message)

      }
    } catch (error) {
      console.log(error);
      toast.error(error.message)
      
    }
  }//link this function with the cross icon

  useEffect(()=>{
    fetchList()//call fetch List function
  },[])//we will run this function whenever this page is reloaded
  return (
    <>
      <p className='mb-2'>All Products List</p>
      <div className='flex flex-col gap-2'>
        {/* List Table Title */}
        <div className='hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center py-1 px-2 border bg-gray-100 text-sm'>
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b className='text-center'>Action</b>
        </div>
        {/* display all products one by one */}
        {/* Product List */}
        {list.map((item,index)=>(//pass individual item and index number in list array.map, create 2 template columns in the below classname, one for phone screen and other for desktop screen
        
          <div className='grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center gap-2 py-1 px-2 border text-sm' key={index}>
            <img className='w-12' src={item.image[0]} alt="" />
            <p>{item.name}</p>
            <p>{item.category}</p>
            {/* <p>{item.price}</p> */}
            <p>{currency}{item.price}</p>
            {/* link this function with the cross icon */}
            <p onClick={()=>removeProduct(item._id)} className='text-right md:text-center cursor-pointer text-lg'>X</p>
            {/* use X to remove the product */}
          </div>
        ))}
        {/* now we have to add all products one by one using admin panel, so that it will be uploaded in db, we can get product details from frontend assets.js file, after adding all products one by one using admin panel, product has been added in db, now we will display these products using frontend, now we will connect frontend with backend */}
      </div>
    </>
  )
}


export default List