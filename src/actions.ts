import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export const fetchOrders = createAsyncThunk('orders/fetchOrders', async () => {
    const response = await fetch('http://localhost:3001/orders ');
    const data = await response.json();
    return data;
});

export const createOrder = createAsyncThunk('orders/createOrder', async (order:any) => {
    const response = await fetch('http://localhost:3001/orders', {
        method: 'POST',
        body: JSON.stringify(order),
        headers: { 'Content-Type': 'application/json' },
    });
    const data = await response.json();
    return data;
});

interface OrdersState {
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    data: any;
    error: string | undefined;
}

const ordersSlice = createSlice({
    name: 'orders',
    initialState: { status: 'idle', data: [], error: '' } as OrdersState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchOrders.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchOrders.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data = action.payload;
            })
            .addCase(fetchOrders.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    },
});

export const { } = ordersSlice.actions;

export default ordersSlice.reducer;
