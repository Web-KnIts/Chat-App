import React, { useEffect, useState } from 'react';
import {Link, useLocation, useNavigate} from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import Avatar from '../components/Avatar';
import { useDispatch } from 'react-redux';
import { setToken } from '../redux/userSlice';
import { handleTitleKeyDown, preventSpace } from './Register';



const CheckPassword = () => {
  const navigate = useNavigate()
  const [show,setShow] = useState(false)
  const [password, setPassword] = useState('');
  const location = useLocation()
  const dispatch = useDispatch();

  useEffect(()=>{
    if(!location?.state?.firstname)
    {
      navigate('/email')
    }
    if(location.state === null)
    {
      navigate('/register')
    }
  })
  const handleSubmit = async(e) => {
    e.stopPropagation();
    e.preventDefault();
    const URL = `${import.meta.env.VITE_BACKEND_URL}/api/check-user-password`;
    try
    {
      const response = await axios.post(URL, {
        password: password,
        userId: location?.state?._id
    },{
      withCredentials:true
    });
      if(response.data.success)
      {
        dispatch(setToken(response?.data?.accessToken))
        localStorage.setItem('token',response?.data?.accessToken)
        toast.success(response.data.message)
        setPassword('');
        navigate('/',{
          state:location?.state
        })
      }
      else
      {
        toast.error(response.data.message)
      }

    }catch(err)
    {
      toast.error(err?.response?.data?.message || err.message)
      console.log(err.message)
    }
  };
  return (
    <div className='h-[80vh] w-full flex justify-center flex-col'>
      <h1 className='text-center pb-8 text-3xl font-bold'>Login</h1>
      <form className='max-w-md mx-auto' onSubmit={handleSubmit}>
        <Avatar margin={true} width={80} height={80} firstname={location?.state?.firstname} lastname={location?.state?.lastname} profile_picture={location?.state?.profile_picture}/>
        <div className='relative z-0 w-full mb-5 group'>
          <input
            type={show?"text":"password"}
            name='password'
            id='floating_password'
            value={password}
            onChange={(e)=>{setPassword(e.target.value)}}
            onKeyDown={handleTitleKeyDown}
            onInput={preventSpace}
            className='block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none  dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer'
            placeholder=' '
            required
          />
          <label
            htmlFor='floating_password'
            className='peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6'
          >
            Password
          </label>
          <div className='text-[12px] mt-5 bg-black w-[60px] px-4 py-2 rounded-[10px] text-white' onClick={()=>{setShow((prev)=>!prev)}}>{show?"hide":"show"}</div>
        </div>
        <button
          type='submit'
          className='w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
        >
          Submit
        </button>
        <p className='mt-4'> <Link to={'/forget-password'} className='text-blue-700'>Forget password ?</Link> </p>
      </form>
    </div>
  );
};


export default CheckPassword
