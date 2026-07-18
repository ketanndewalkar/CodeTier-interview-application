import React from 'react'
import { useUserStore } from './store/userStore'
import { BrowserRouter, RouterProvider } from 'react-router-dom';
import { router } from './app/routes';
import { useEffect } from 'react';

const App = () => {
  
  return (
    <>
    <RouterProvider router={router}/>
    </>
  )
}

export default App