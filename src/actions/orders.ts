import { api } from '../api';
import { AppDispatch } from '../app/store';
export const fetchCurrentOrders = () => async (dispatch:AppDispatch) => {
  const { data } = await api.get('/orders/current');
  dispatch({ type: 'FETCH_CURRENT_ORDERS', payload: data });
};

export const fetchFinishedOrders = () => async (dispatch:AppDispatch) => {
  const { data } = await api.get('/orders/finished');
  dispatch({ type: 'FETCH_FINISHED_ORDERS', payload: data });
};

export const createOrder = (toppings: string[]) => async (dispatch:AppDispatch) => {
  const { data } = await api.post('/order', { toppings });
  dispatch({ type: 'CREATE_ORDER', payload: data });
};

export const updateOrderStatus = (orderId: string, status: string) => async (dispatch:any) => {
  const { data } = await api.patch(`/orders/${orderId}`, { status });
  dispatch({ type: 'UPDATE_ORDER_STATUS', payload: data });
};
