import React from 'react'
import { createBrowserRouter,RouterProvider } from 'react-router-dom';
import CurrentOrders from './CurrentOrders';
import FinishedOrders from './FinishedOrders';
import Header from './Header'
import Order from './Order';

type Props = {}
const router = createBrowserRouter([
    {
      path: "/",
      element: <Order/>,
    },
    {
        path: "/currentOrders",
        element: <CurrentOrders/>,
      },
      {
        path: "/finishedOrders",
        element: <FinishedOrders/>,
      },
  ]);

export default function MainLayout({}: Props) {
  return (
    <div>
        <Header/>
        <RouterProvider router={router}/>
    </div>
  )
}