// @ts-nocheck
import React, { useState,useMemo,useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addOrder } from './features/PizzaSlice';
import Select from 'react-select'
import makeAnimated from 'react-select/animated';
import { toast } from 'react-toastify';



     function Order(){


        const status = useSelector((state:any) => state.pizza.status);
        const [isLoading, setIsLoading] = useState(false);
        useMemo(() => {
            if(status == 'succeeded' || status == 'failed'){
                setIsLoading(false)
            }
          }
          , [status])
        const animatedComponents = makeAnimated();
        const toppings = useRef([])
        const filterToppings=(values)=>{
            toppings.current= values.map(obj=>obj.value)
        }

        const options = [
            { value: 'mushrooms', label: 'Mushrooms' },
            { value: 'corn', label: 'corn' },
            { value: 'olives', label: 'Olives' },
            { value: 'onion', label: 'Onions' },
            { value: 'extra cheese', label: 'Extra Chees' },
            { value: 'eggs', label: 'Eggs' },



          ]


        const dispatch=useDispatch()





    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h1 className='underline font-bold'>Create  Pizza Order</h1>

            <div className="w-full max-w-xs">
  <form onSubmit={(e)=>{
    e.preventDefault()
    setIsLoading(true)
    if(toppings.current.length<1){
        setIsLoading(false)
        toast.error("Please select atleast one topping")
    }else{
         dispatch(addOrder({
             toppings:toppings.current
         }))
    }

  }} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
    <div className="mb-4">
      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
        Topping(s)
      </label>
      <Select
            closeMenuOnSelect={false}
            components={animatedComponents}
            isMulti
            onChange={(values)=>{
                filterToppings(values)
            }}
       className='shadow appearance-none border rounded
       w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline' options={options} />
    </div>

    <div className="flex items-center justify-between">
      <button disabled={isLoading} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
         {isLoading?'loading...':'Order'}
      </button>
    </div>
  </form>

</div>
        </div>
    );

    }
export default Order;

