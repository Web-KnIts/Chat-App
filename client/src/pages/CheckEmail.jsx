import React, { useState } from 'react';
import {Link, useNavigate} from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import { handleTitleKeyDown, preventSpace } from './Register';



const CheckEmail = () => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();
  const handleSubmit = async(e) => {
    e.stopPropagation();
    e.preventDefault();
    await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/check-user-email`,{email}).then((response)=>{
      if(response.data.success)
        {
          toast.success(response.data.message)
          navigate('/password',{
            state:response?.data.data
          })
          setEmail('')
        }
        else
        {
          toast.error(response.data.message)
        }
      }).catch(err=>{
        toast.error(err?.response?.data?.message)
        console.log(err.message)
      })
  };
  return (
    <div className='h-[80vh] w-full flex justify-center flex-col'>
      <h1 className='text-center pb-8 text-3xl font-bold'>Login</h1>
      <form className='max-w-md mx-auto' onSubmit={handleSubmit}>
        <div className='relative z-0 w-full mb-5 group'>
          <input
            type='email'
            name='email'
            id='floating_email'
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            onKeyDown={handleTitleKeyDown}
            onInput={preventSpace}
            className='block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer'
            placeholder=' '
            required
          />
          <label
            htmlFor='floating_email'
            className='peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6'
          >
            Email address
          </label>
        </div>
        <button
          type='submit'
          className='w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
        >
         Let's Go
        </button>
        <p className='mt-4'>Dont Have an Account ? <Link to={'/register'} className='text-blue-700'>Create Account</Link> </p>
      </form>
    </div>
  );
};
export default CheckEmail