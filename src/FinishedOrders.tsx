import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { fetchFinishedOrders } from './actions/orders';

function FinishedOrders() {
  const [isLoading, setIsLoading] = useState(true);
  const finishedOrders = useSelector((state:any) => state.orders.finishedOrders);

  useEffect(() => {
    fetchFinishedOrders().then(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Finished Orders</h2>
      <table>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Toppings</th>
            <th>Preparation Time</th>
          </tr>
        </thead>
        <tbody>
          {finishedOrders.map((order:any) => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.toppings.join(', ')}</td>
              <td>{order.preparationTime} seconds</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default FinishedOrders;
``
