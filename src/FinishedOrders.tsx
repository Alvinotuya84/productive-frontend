import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrders } from './features/PizzaSlice';

function FinishedOrders() {
  const [isLoading, setIsLoading] = useState(true);
  const finishedOrders = useSelector((state:any) => state.pizza.finishedOrders);
  const status = useSelector((state:any) => state.pizza.status);


  const dispatch=useDispatch()

  useEffect(() => {
    dispatch(fetchOrders())
  }, []);

  useMemo(() => {
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
      <h2>Finished Orders</h2>
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">Order ID</th>
            <th scope="col" className="px-6 py-3">Toppings</th>
            <th scope="col" className="px-6 py-3">Preparation Time</th>
          </tr>
        </thead>
        <tbody>
          {finishedOrders.map((order:any) => (
            <tr key={order.id}>
              <td className="px-6 py-4">{order.id}</td>
              <td className="px-6 py-4">{order.toppings.join(', ')}</td>
              <td className="px-6 py-4">{order.preparationTime} seconds</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default FinishedOrders;
``
