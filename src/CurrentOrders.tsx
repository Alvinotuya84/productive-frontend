
// @ts-nocheck

import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrders } from './features/PizzaSlice';
import io from 'socket.io-client';
import {  toast } from 'react-toastify';


function CurrentOrders() {
   const filterOrdersCategory = (orders) => {
    const filteredData = orders.filter(item => item.status !== 'completed');
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
        delay:1300
      });
       filterOrdersCategory(orders)});
socket.on('orderCompleted', (orders) => {

    toast.success('One Order has been Completed Check Under the Finished Orders Tab',{
      toastId:'completed-order'
    });
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
      <h2>Current Orders</h2>
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">Order ID</th>
            <th scope="col" className="px-6 py-3">Toppings</th>
            <th scope="col" className="px-6 py-3">Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order:any,index:number) => (
            <tr key={index}>
              <td className="px-6 py-4">{order._id}</td>
              <td className="px-6 py-4">{order.toppings.join(', ')}</td>
              <td className="px-6 py-4">
              {order.status === 'completed' ? <button type="button" className="text-white bg-gradient-to-r
               from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4
                focus:outline-none
                 focus:ring-green-300 dark:focus:ring-green-800 shadow-lg
                  shadow-green-500/50 dark:shadow-lg dark:shadow-green-800/80
                  font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2">completed</button>
 :
 order.status === 'in progress' ?
 <button type="button" className="text-white bg-gradient-to-r
  from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br
  focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800
  shadow-lg shadow-cyan-500/50 dark:shadow-lg dark:shadow-cyan-800/80 font-medium
  rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2">In Progress</button>

 :
       <button type="button" className="text-gray-900 bg-gradient-to-r
        from-yellow-200 via-yellow-400 to-lime-500 hover:bg-gradient-to-br
        focus:ring-4 focus:outline-none focus:ring-lime-300 dark:focus:ring-lime-800 shadow-lg shadow-lime-500/50 dark:shadow-lg dark:shadow-lime-800/80 font-medium rounded-lg
        text-sm px-5 py-2.5 text-center mr-2 mb-2">Pending</button>

      }
          </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CurrentOrders;
