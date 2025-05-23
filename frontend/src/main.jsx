import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {BrowserRouter} from "react-router-dom"
import ShopContextProvider from './context/ShopContext.jsx'
// Browser router is used for creating routes (multiple routes for multiple pages)

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  {/* after adding the below(shopcontextprovider), we will get the support of context api in our project and we can use the context values in any component */}
  <ShopContextProvider>
  
  <App />
  </ShopContextProvider>
   
  </BrowserRouter>,
)

