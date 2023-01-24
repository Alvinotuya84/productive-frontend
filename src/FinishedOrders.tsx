
// @ts-nocheck

import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrders ,clearAllOrders, deleteOrder} from './features/PizzaSlice';
import io from 'socket.io-client';
import {  toast } from 'react-toastify';
import { format } from 'date-fns';
import Swal from 'sweetalert2'
import jsPDF from "jspdf";
import "jspdf-autotable";


function FinishedOrders() {


   const filterOrdersCategory = (orders) => {
    const filteredData = orders.filter(item => item.status === 'completed');
    setOrders(filteredData);
  }

  const {orders,deletingStatus,status} = useSelector((state:any) => state.pizza);


    const [isLoading, setIsLoading] = useState(true);
  const [allOrders,setOrders]=useState([] )
  const [orderID,setOrderID]=useState('')


  const dispatch=useDispatch()



  const socket = io('http://localhost:3001');

  const printReport=()=>{
    const unit = "pt";
    const size = "A5";// Use A1, A2, A3 or A4
    const orientation = "landscape";

    const marginLeft = 10;
    const doc = new jsPDF(orientation, unit, size);

    doc.setFontSize(17);

    const title = "Orders Report";
    const headers = [["ORDER ID", "TOPPINGS","DOUGH TIME","TOPPING TIME","OVEN TIME","WALK TIME","START TIME","COMPLETED TIME"]];

    const data = allOrders.map(elt=> [elt._id, elt.toppings.join(', '),
    elt.doughPrepTime,elt.toppingPrepTime,elt.ovenPrepTime,elt.walkTime,
    format(new Date(elt.timeStarted), "hh:mm:ss aa"),
    format(new Date(elt.timeCompleted), "hh:mm:ss aa")
  ]);

    let content = {
      startY: 50,
      head: headers,
      body: data,
      rowHeight:30
    };
    doc.setTextColor("#1683d8")
    doc.text(doc.internal.pageSize.getWidth()/2,20,title ,null,null, "center");
    doc.autoTable(content);
    doc.save("report.pdf")
  }



useEffect(() => {
  socket.on('newOrder', (orders) => {
    toast.warning('New Order Detected! Wait for its preparation you can view it under the Current Orders Tab!',{
      toastId:'new-order',
      autoClose:7000,
      pauseOnFocusLoss: false


    });

    filterOrdersCategory(orders)});
socket.on('orderCompleted', (orders,orderId) => {
  toast.success(`Order of Order ID ${orderId} Completed Check Finished Orders Tab`,{
    toastId:orderId,
    pauseOnFocusLoss: false

  });

  filterOrdersCategory(orders)
  });
  socket.on('orderDeleted', (orders) => {
    filterOrdersCategory(orders)});
  socket.on('allOrdersDeleted', (orders) => {
  filterOrdersCategory(orders)
  });

}, []);

  useEffect(() => {
    dispatch(fetchOrders())
  }, []);



  useMemo(() => {
    filterOrdersCategory(orders)
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
      <div className="flex justify-between w-full">
            <button onClick={()=>{

      Swal.fire({
      title: 'Are you sure you want to delete all orders?',
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

      }} disabled={isLoading} type="button" className="text-white bg-gradient-to-r
      from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br
      focus:ring-4 focus:outline-none focus:ring-red-300
      dark:focus:ring-red-800 shadow-lg shadow-red-500/50 dark:shadow-lg
      dark:shadow-red-800/80 font-medium rounded-lg
      text-sm px-5 py-2.5 text-center mr-2 mb-2">{isLoading?'loading...':'Clear All'}
      </button>
      <button onClick={()=>{
        printReport()
}}  type="button" className="text-white
bg-gradient-to-r from-green-400 gray-pink-500
 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-gray-300
  dark:focus:ring-green-800 shadow-lg shadow-gray-500/50 dark:shadow-lg
   dark:shadow-green-800/80 font-medium rounded-lg text-sm px-5
    py-2.5 text-center mr-2 mb-2">
      Print Report
      </button>
      </div>
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
            <th scope="col" className="px-6 py-3">Ip Address</th>
            <th scope="col" className="px-6 py-3">Action</th>
          </tr>
        </thead>
        <tbody>
          {allOrders.map((order:any,index:number) => (
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
            <td>
            {order.ipaddress}
          </td>
          <td>
          <button onClick={()=>{

Swal.fire({
title: 'Are you sure you want to delete this order?',
text: "You won't be able to revert this!",
icon: 'warning',
showCancelButton: true,
confirmButtonColor: '#3085d6',
cancelButtonColor: '#d33',
confirmButtonText: 'Yes, delete it!'
}).then((result) => {
if (result.isConfirmed) {
  setOrderID(order._id)
dispatch(deleteOrder(order._id))
}
})

}} disabled={deletingStatus==='loading' && orderID==order._id} type="button" className="text-white
bg-gradient-to-r from-gray-400 gray-pink-500
 to-gray-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-gray-300
  dark:focus:ring-gray-800 shadow-lg shadow-gray-500/50 dark:shadow-lg
   dark:shadow-gray-800/80 font-medium rounded-lg text-sm px-5
    py-2.5 text-center mr-2 mb-2">{deletingStatus==='loading' && orderID==order._id?'loading...':'Delete'}</button>
          </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default FinishedOrders;
