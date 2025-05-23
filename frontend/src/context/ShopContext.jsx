//this file is used to store common variables and state variables at one place

import { createContext, useEffect, useState } from "react";
// import { products } from "../assets/assets";
import { toast } from "react-toastify";
import {useNavigate} from "react-router-dom"
import axios from "axios"

//export to access it in any other component also
export const ShopContext=createContext()

const ShopContextProvider=(props)=>{

    const currency='Rs.'//so that we can change currecy for the entire web page, if you want to use other currecny, you can change it here
    const delivery_fee=10
    const backendUrl=import.meta.env.VITE_BACKEND_URL
    const [search,setSearch]=useState('')
    const [showSearch,setShowSearch]=useState(false)//when this is true we will display the search bar else we will hide the search bar
    const [cartItems,setCartItems]=useState({})
    const [products,setProducts]=useState([])
    // now we have added api in frontend using that we can display the product in the frontend we have added using admin panel
    const [token,setToken]=useState("")//when we will be authenticated, we will get token and store token in state variable
    const navigate=useNavigate()

    const addToCart=async (itemId,size)=>{//in cartItems object we are adding all cartdata, now whenever we will call this function, we will check if we are logged in, then in db also we will update the cart
        //logic to that when we select any product and size, we can add that product to cart
        //create copy of cart items
        {/* logic so that if we have not selected any size and we click add to cart, the product will not be selected added in the cart */}
        if (!size) {
            toast.error('Select Product Size')
            return//to stop execution of the function
            
        }
        let cartData=structuredClone(cartItems)//to create one copy of this object, we are using structuredClone

        if (cartData[itemId]) {//if cartdata has any property available with this itemId, in that case we will add another if statement
            if (cartData[itemId][size]) {//if cartData has any product with itemId and this size, then we will increase product entry by 1
                cartData[itemId][size]+=1
            }
            else{//if we have 1 product entry but we don't have one product entry with the same size, then we will create a new entry
                cartData[itemId][size]=1//where itemId will be key name and size will be available in that value

            }
            
        }else{//if in cartData, we don't have any particular entry with this item id, then we will create a new entry and we can use that for our cart page
            cartData[itemId]={}
            cartData[itemId][size]=1
        }//now we will save this cart data in this cartItems state variable
        setCartItems(cartData)

        // link api directly with our frontend
        if (token) {//if token is available we are logged in, in that case we will call api
            try {
                await axios.post(backendUrl +'/api/cart/add',{itemId,size},{headers:{token}})//concat api for add, we have to provide product id and size(using itemid and size from parameters)-send these properties in the body, using that our product will be added in db whenever we are logged in
            } catch (error) {
                console.log(error);
                toast.error(error.message)
            }

            
        }
    }//it is updating cart in db

    // add logic so that when we add any product in the cart, then number of quantity will be displayed on the cart Icon
    const getCartCount=()=>{
        let totalCount=0
        //for in loop on cartItems state
        for(const items in cartItems){//help us to iterate the items
            for(const item in cartItems[items]){//it will iterate product size
                try {
                    if (cartItems[items][item]>0) {//in cartItem we have product with particular size, in that case we will increase the count
                        totalCount+=cartItems[items][item]//total count of that product with particular size
                        
                    }
                } catch (error) {
                    
                }
            }
        }
        return totalCount
    }

    //so that we can clear cart data or modify cart items
    const updateQuantity=async (itemId,size, quantity)=>{//add api in update quantity, so that when we add cart page and update any quantity, then that quantity will be updated in db
        //for the item id and size we will update quantity
        let cartData=structuredClone(cartItems)
        cartData[itemId][size]=quantity
        //save cartData in cartItems state
        setCartItems(cartData)
        //add api in update quantity, so that when we add cart page and update any quantity, then that quantity will be updated in db
        if (token) {//if token is available(we are logged in)
            try {
                await axios.post(backendUrl + '/api/cart/update',{itemId,size,quantity}, {headers:{token}})//we will call api, add cart update endpoint, provide itemId, size and quantity, add headers with token as an object
            } catch (error) {
                console.log(error);
                toast.error(error.message)
            }
            
        }
    }

    // add logic so that whenever we reload the webpage, cart data will be updated in db and it will display that in cart data
    const getUserCart=async(token)=>{//run this function whenever we will reload the webpage
        try {
            const response=await axios.post(backendUrl + '/api/cart/get',{},{headers:{token}})//where we will store api response, call api endpoint to get cart data, we don't have to send anything in body and provide headers, token
            if (response.data.success) {//it means we have received cart data
                setCartItems(response.data.cartData) //store cart data in state variable
                
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message)
        }
    }//now we have integrated cart api with our frontend, now we can fetch user's cart data when we reload the webpage, with that we can add product in cart and that product will be added in db, if we update/delete the product it is also updating in db

    const getCartAmount=()=>{
        let totalAmount=0
        for(const items in cartItems){//we will get product using item id
            let itemInfo=products.find((product)=>product._id===items)
            for(const item in cartItems[items]){
                try {
                    if(cartItems[items][item]>0){//if this >0, we will calculate total amount
                        totalAmount+=itemInfo.price*cartItems[items][item]//product price*product quantity=total amount
                    }
                } catch (error) {
                    console.log(error);
            toast.error(error.message)
                }
            }

        }

        return totalAmount
    }


    const getProductsData=async()=>{//call this function in useEffect below, get product data from api
        try {//call api here
            const response=await axios.get(backendUrl + '/api/product/list')//our product list api type is get, here we will get backendUrl and then concatinate product list api endpoint
           // console.log(response.data)//check the response
            if(response.data.success){
            
            
            setProducts(response.data.products)
        }else{
            toast.error(response.data.message)
        }
            
        } catch (error) {
            console.log(error);
            toast.error(error.message)
            
        }
    }

    useEffect(()=>{
        getProductsData()
    },[])


    //if we reload the webpage, token is removed and now we have come back to the login page, here we have an issue, when we refresh the webpage, it will remove token from the state variable, thats why it is opening login page, now we will add logic so that we will check if localstorage have this token, using that token we will update state variable so that whenever we will refresh this webpage again we will be loggedin(in shopContext.jsx file)
    useEffect(()=>{
        if (!token && localStorage.getItem("token")) {//if token is not available and token is available in local storage, in that case we will store localstorage token in token state, key name="token"
            setToken(localStorage.getItem("token"))//we will call setToken function and provide token from localstorage
            getUserCart(localStorage.getItem("token"))//send the token
            
        }//executed whenever we have the token and we will send the token
    },[])
    //when this cartItems will be modified, then we will add the console log
    // useEffect(()=>{
    //     console.log(cartItems);
        
    // },[cartItems])

    //whenever we add any variable, state variable or funciton within the value object, we can access it in any component using context api
    const value={
        products,
        currency,
        delivery_fee,//add values here so we can access it in any component
        search,
        setSearch,
        showSearch,
        setShowSearch,
        cartItems,
        setCartItems,
        addToCart,
        getCartCount,
        updateQuantity,
        getCartAmount,
        navigate,
        backendUrl,//added here so that we can access it in any component, now we will get product data fromt the api
        setToken,
        token
    }

    return (
        // value is the value object created above
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    )
}

export default ShopContextProvider