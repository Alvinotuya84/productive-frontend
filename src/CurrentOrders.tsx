import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { fetchCurrentOrders } from './actions/orders';

function CurrentOrders() {
  const [isLoading, setIsLoading] = useState(true);
  const currentOrders = useSelector((state:any) => state.orders.currentOrders);

  useEffect(() => {
    fetchCurrentOrders().then(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Current Orders</h2>
      <table>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Toppings</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {currentOrders.map((order:any) => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.toppings.join(', ')}</td>
              <td>{order.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CurrentOrders;
