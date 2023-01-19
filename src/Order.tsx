// @ts-nocheck
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addOrder } from './features/PizzaSlice';
import { AppDispatch } from './app/store';

interface Props {}

const Order: React.FC<Props> = () => {
    const [formData, setFormData] = useState({
        toppings: []
    });
    const dispatch = useDispatch<AppDispatch>();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(addOrder(formData));
        setFormData({ toppings: [] });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <form onSubmit={handleSubmit}>
                <label className="block font-medium text-lg mb-2">
                    Toppings:
                </label>
                <input
                    className="bg-gray-200 p-2 rounded-lg w-full"
                    type="text"
                    name="toppings"
                    value={formData.toppings}
                    onChange={handleChange}
                />
                <button className="bg-indigo-500 text-white p-2 rounded-lg hover:bg-indigo-600">
                    Create Order
                </button>
            </form>
        </div>
    );
};

export default Order;

