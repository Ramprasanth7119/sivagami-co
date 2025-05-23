import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  //we will fix this port in react project, so that when we run this project in any order port number will be same, right now backend is running at port 4000 and frontend is running on port 5173 amd admin panel is running at 5174, so that when we stop project, first we will start the admin panel at 5173 and frontend at 5173, so to prevent that we will go to vite.config file
  server:{port:5173}//now if we start our project in any order, frontend port will be 5173 and admin panel port will be 5174
})
