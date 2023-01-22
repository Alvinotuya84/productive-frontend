
// @ts-nocheck

import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrders ,clearAllOrders} from './features/PizzaSlice';
import io from 'socket.io-client';
import {  toast } from 'react-toastify';
import { format } from 'date-fns';
import Swal from 'sweetalert2'



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



useEffect(() => {
  socket.on('newOrder', (orders) => {
    toast.warning('New Order Detected! Wait for approximately 30 seconds for preparation you can view it under the Current Orders Tab!',{
      toastId:'new-order',
      autoClose:7000,
      pauseOnFocusLoss: false


    });

    filterOrdersCategory(orders)});
socket.on('orderCompleted', (orders) => {
  toast.success('One Order has been Completed Check Under the Finished Orders Tab',{
    toastId:'completed-order',
    pauseOnFocusLoss: false

  });

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
      <button onClick={()=>{

        Swal.fire({
  title: 'Are you sure?',
  text: "You won't be able to revert this!",
  icon: 'warning',
  showCancelButton: true,
  confirmButtonColor: '#3085d6',
  cancelButtonColor: '#d33',
  confirmButtonText: 'Yes, delete it!'
}).then((result) => {
  if (result.isConfirmed) {
    setIsLoading(true)
    dispatch(clearAllOrders())
  }
})

      }} disabled={isLoading} type="button" className="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 shadow-lg shadow-red-500/50 dark:shadow-lg dark:shadow-red-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2">{isLoading?'loading...':'Clear All'}</button>

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
