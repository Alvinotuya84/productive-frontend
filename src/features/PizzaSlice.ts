// @ts-nocheck

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2'




 const baseUrl='http://localhost:3001/api'
 export const fetchOrders = createAsyncThunk('pizza/fetchOrders', async () => {
  const { data } = await axios.get(`${baseUrl}/order`);
  return data;
});

export const addOrder = createAsyncThunk('pizza/addOrder', async (order) => {
  const { data } = await axios.post(`${baseUrl}/order`, order);
  return data;
});

export const updateOrderStatus = createAsyncThunk('pizza/updateOrderStatus', async (orderId, status) => {
  const { data } = await axios.patch(`${baseUrl}/order/${orderId}`, { status });
  return data;
});
export const clearAllOrders = createAsyncThunk('pizza/clearOrders', async () => {
  const { data } = await axios.delete(`${baseUrl}/order`);
  return data;
});

const initialState = {
  orders: [],
  currentOrders: [],
  finishedOrders: [],
  status: 'idle',
  error: null,
};

const pizzaSlice = createSlice({
  name: 'pizza',
  initialState,
  reducers: {
    moveOrderToCurrent: (state, action) => {
      const { orderId } = action.payload;
      const orderIndex = state.orders.findIndex(order => order.id === orderId);
      const [order] = state.orders.splice(orderIndex, 1);
      state.currentOrders.push(order);
    },
    moveOrderToFinished: (state, action) => {
      const { orderId } = action.payload;
      const currentOrderIndex = state.currentOrders.findIndex(order => order.id === orderId);
      const [order] = state.currentOrders.splice(currentOrderIndex, 1);
      state.finishedOrders.push(order);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.status = 'failed';
        toast.error(action.error.message)
        state.error = action.error.message;
      })
      .addCase(addOrder.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addOrder.fulfilled, (state, action) => {
        state.status = 'succeeded';
        toast.info(`Processing Order ID:${action.payload._id}`,{
          autoClose: 27000,
          pauseOnFocusLoss: false,
          pauseOnHover:false

        })

      })
      .addCase(addOrder.rejected, (state, action) => {
        state.status = 'failed';
        toast.error(action.error.message)
        state.error = action.error.message;
      })
      .addCase(updateOrderStatus.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const orderIndex = state.orders.findIndex(order => order.id === action.payload.id);
        state.orders[orderIndex] = action.payload;
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      }).addCase(clearAllOrders.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(clearAllOrders.fulfilled, (state, action) => {
        state.status = 'succeeded';
        Swal.fire(
          'Deleted!',
          'All Orders Deleted Succesfully.',
          'success'
        )
      })
      .addCase(clearAllOrders.rejected, (state, action) => {
        state.status = 'failed';
        toast.error(action.error.message)
        state.error = action.error.message;
      });
  },
});

export default pizzaSlice.reducer;
