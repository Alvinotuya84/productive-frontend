
// @ts-nocheck

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrders } from './features/PizzaSlice';
import io from 'socket.io-client';
import {  toast } from 'react-toastify';
import { format } from 'date-fns';



function FinishedOrders() {
   const filterOrdersCategory = (orders) => {
    const filteredData = orders.filter(item => item.status === 'completed');
    setOrders(filteredData);
  }

  const currentOrders = useSelector((state:any) => state.pizza.orders);
  const status = useSelector((state:any) => state.pizza.status);
    const [isLoading, setIsLoading] = useState(true);
  const [orders,setOrders]=useState([] )

  const dispatch=useDispatch()



  const socket = io('http://localhost:3001');


  const toastId = useRef(null);

useEffect(() => {
  socket.on('newOrder', (orders) => {
    if(! toast.isActive(toastId.current)) {
      toastId.current = toast.warning('There is new Order !');
    }

    filterOrdersCategory(orders)});
socket.on('orderCompleted', (orders) => {
  if(! toast.isActive(toastId.current)) {
    toastId.current = toast.success('One Order has been Completed !');
  }

  filterOrdersCategory(orders)
  });
  socket.on('allOrdersDeleted', (orders) => {
  filterOrdersCategory(orders)
  });

}, []);

  useEffect(() => {
    dispatch(fetchOrders())
  }, []);



  useMemo(() => {
    filterOrdersCategory(currentOrders)
    if(status == 'succeeded' || status == 'failed'){
        setIsLoading(false)
    }
  }
  , [status])
  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="relative overflow-x-auto">
      <button type="button" class="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 shadow-lg shadow-red-500/50 dark:shadow-lg dark:shadow-red-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2">{isloading?'loading...':'Clear All'}</button>

      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">Order ID</th>
            <th scope="col" className="px-6 py-3">Toppings</th>
            <th scope="col" className="px-6 py-3">Dought Time</th>
            <th scope="col" className="px-6 py-3">Topping Time</th>
            <th scope="col" className="px-6 py-3">Oven Time</th>
            <th scope="col" className="px-6 py-3">Walk time</th>
            <th scope="col" className="px-6 py-3">Completed Time</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order:any,index:number) => (
            <tr key={index}>
              <td className="px-6 py-4">{order._id}</td>
              <td className="px-6 py-4">{order.toppings.join(', ')}</td>
              <td className="px-6 py-4">{order.doughPrepTime}</td>
              <td className="px-6 py-4">{order.toppingPrepTime}</td>
              <td className="px-6 py-4">{order.ovenPrepTime}</td>
              <td className="px-6 py-4">{order.walkTime}</td>
              <td className="px-6 py-4">
                {format(new Date(order.timeCompleted), "hh:mm:ss aa")}
          </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default FinishedOrders;
