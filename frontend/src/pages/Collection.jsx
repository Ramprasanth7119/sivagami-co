//we will display all products and create filters in this page

import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import { assets } from '../assets/assets'
import Title from '../components/Title'
import ProductItem from '../components/ProductItem'


const Collection = () => {
  
  //we will get data of all products using context api
  const { products,search,showSearch } = useContext(ShopContext)
  const [showFilter, setShowFilter] = useState(false)
  const [filterProducts, setFilterProducts] = useState([])
  //add logic on these filters
  const [category,setCategory]=useState([])
  const [subCategory,setSubCategory]=useState([])
  const [sortType,setSortType]=useState('relevant')

  //arrow functions to add data in the category state

  const toggleCategory=(e)=>{
    //if we select the mens category and mens category is already available in the category state then we will remove that category
    //if it is not available in that array, we will add that
    if (category.includes(e.target.value)) {//if category is already available in the category state, in that case we have to filter out that category
      setCategory(prev=>prev.filter(item=>item!==e.target.value))//from the previous categories, in previous array we will use the filter method and in filter method we will pass the individual item and we will check if this item is not =e.target.value, in that case we will store those category, if it is matching, then that category will be removed from the category array
    }
    else{//category is not available in category array
      setCategory(prev=>[...prev,e.target.value])//add new entry in the array, add that category 
    }
  }

  const toggleSubCategory=(e)=>{
    if (subCategory.includes(e.target.value)) {//if subcategory is already available in the subcategory state, in that case we have to filter out that subcategory
        setSubCategory(prev=>prev.filter(item=>item!==e.target.value))//we will remove that value
    }else{//subcategory is not available in subcategory array
      setSubCategory(prev=>[...prev,e.target.value])//add new entry in the array, add that subcategory 
    }
  }

  //now we will use category and subcategory states to create a filter

  const applyFilter=()=>{//we have to run this function whenever category or subcategory array will be updated
    //creating copy of all products
    
    
    let productsCopy=products.slice()

     //adding logic so that if I type something in searchbar, then it will display product related to particular search query, using these states, we will filter product using the search query
     if (showSearch && search) {//if showSearch is true and in search we have any text available, we will use search to filter the products
      productsCopy=productsCopy.filter(item=>item.name.toLowerCase().includes(search.toLowerCase()))//add individual item, we are making product name in lower case and making the search query also in the lower case, and we are searching if this search query is available in any product name, then that product will be filtered
      
     }

    if (category.length>0) {//if we have selected any category
      productsCopy=productsCopy.filter(item=>category.includes(item.category))//if category we have selected, in that product category is available, in that case we will save that product else we will remove that product

    }

    if (subCategory.length>0) {//if we have selected any subcategory in the filter, in that case we have to filter the products
      productsCopy=productsCopy.filter(item=>subCategory.includes(item.subCategory))//if subcategory we have selected, in that product subcategory is available, in that case we will save that product else we will remove that product

    }
//if we have not selected any filter and page is loading for the first time, then this copy will be created and it will be stored in the setFiltered Products 
    setFilterProducts(productsCopy)
  }

  // useEffect(()=>{
  //   setFilterProducts(products)
  // },[])//whenever this component will get loaded, then this function will be executed

  const sortProduct=()=>{
    //create a copy for the filter product
    //suppose we have selected any category and we have applied the filter, then using that filter, we can use the sort feature
    let fpCopy=filterProducts.slice()

    switch(sortType){
      case 'low-high':
        setFilterProducts(fpCopy.sort((a,b)=>(a.price-b.price)))
        break

        case 'high-low':
          setFilterProducts(fpCopy.sort((a,b)=>(b.price-a.price)))
          break

        default:
          applyFilter()
          break
    }
  }

  useEffect(()=>{
    applyFilter()//will filter category based on the category, subCategory or the search query
  },[category,subCategory,search,showSearch,products])//whenever any of these get updated, we will execute this function, whenever search will be changed, apply Filter function will be executed

  useEffect(()=>{
    sortProduct()
  },[sortType])//whenever we change the sorttype this function will be executed

  // useEffect(()=>{
  //   console.log(category);
    
  // },[category])

  // useEffect(()=>{
  //   console.log(subCategory);
    
  // },[subCategory])

  return (
    <div className='flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t'>
      {/* creating filter options-left side create filters and right side we will display the products */}
      {/* Filter Options */}
      <div className="min-w-60">
        {/* adding logic so that when we are on the phone screen and click on filters, then it will display filter options */}
        {/* if showFilter is  true, it will make it false else true in onclick method */}
        <p onClick={() => setShowFilter(!showFilter)} className='my-2 text-xl flex items-center cursor-pointer gap-2'>FILTERS
          {/* creating dynamic classname */}
          {/* for small screen and above it will be hidden */}
          {/* if showFilter state is true, then we will add classname of rotate-90 else we will provide one empty string */}
          <img className={`h-3 sm:hidden ${showFilter ? 'rotate-90' : ''}`} src={assets.dropdown_icon} alt="" />
        </p>
        {/* creating Category Filter */}
        {/* in small screen box is hidden and is visible in the large screen */}
        {/* we will display the box whenever we click on filters */}
        {/* creating dynamic classname */}
        <div className={`border border-gray-300 pl-5 py-3 mt-6 ${showFilter ? '' : 'hidden'} sm:block`}>
          <p className='mb-3 text-sm font-medium'>CATEGORIES</p>
          <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
            <p className='flex gap-2'>
              <input className='w-3' type="checkbox" value={'Men'} onChange={toggleCategory} />Men
            </p>
            <p className='flex gap-2'>
              <input className='w-3' type="checkbox" value={'Women'} onChange={toggleCategory} />Women
            </p>
            <p className='flex gap-2'>
              <input className='w-3' type="checkbox" value={'Kids'} onChange={toggleCategory} />Kids
            </p>
          </div>
        </div>
        {/* SubCategory Filter */}
        <div className={`border border-gray-300 pl-5 py-3 my-5 ${showFilter ? '' : 'hidden'} sm:block`}>
          <p className='mb-3 text-sm font-medium'>TYPE</p>
          <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
            <p className='flex gap-2'>
              <input className='w-3' type="checkbox" value={'Topwear'} onChange={toggleSubCategory} />Topwear
            </p>
            <p className='flex gap-2'>
              <input className='w-3' type="checkbox" value={'Bottomwear'} onChange={toggleSubCategory} />Bottomwear
            </p>
            <p className='flex gap-2'>
              <input className='w-3' type="checkbox" value={'Winterwear'} onChange={toggleSubCategory} />Winterwear
            </p>
          </div>
        </div>
      </div>
      {/* Right Side */}
      <div className="flex-1">
        <div className="flex justify-between text-base sm:text-2xl mb-4">
          {/* text1 and text2 are destructured in Title component */}
          <Title text1={'ALL'} text2={'COLLECTIONS'} />
          {/* Product Sort */}
          {/* when we will change setSortType, it will change the sortType state variable  */}
          <select onChange={(e)=>setSortType(e.target.value)} className='border-2 border-gray-300 text-sm px-2'>
            <option value="relavent">Sort by: Relavent</option>
            <option value="low-hight">Sort by: Low to High</option>
            <option value="high-low">Sort by: High to Low</option>
          </select>
        </div>

        {/* Map Products */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6">
          {/* map all products */}
          {filterProducts.map((item,index)=>(
            <ProductItem key={index} name={item.name} id={item._id} price={item.price} image={item.image} />//props destructured in the ProductItem component
          ))}
        </div>
      </div>
    </div>
  )
}

export default Collection