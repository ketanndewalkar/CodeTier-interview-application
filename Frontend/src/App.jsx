import React from 'react'
import { useUserStore } from './store/userStore'
import { BrowserRouter, RouterProvider } from 'react-router-dom';
import { router } from './app/routes';
import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';

const App = () => {
  
  return (
    <>
    <RouterProvider router={router}/>
    <Toaster position="bottom-right" reverseOrder={false} />
    </>
  )
}

export default App