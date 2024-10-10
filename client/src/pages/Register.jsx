import React, { useState } from 'react';
import {Link, useNavigate} from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import uploadFileIntoCloudinary from '../config/cloudinaryImageUpload';

export const handleTitleKeyDown = (e) => {
  if (e.keyCode === 13) {
    e.preventDefault();
  }
};

export const preventSpace = (e) => {
  e.target.value = e.target.value.replace(/  +/g, ' ');
};


const Register = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    firstname: '',
    lastname: '',
    gender: '',
    email: '',
    password: '',
    confirmPassword: '',
    profile_picture:null
  });
  const [uploadedImage,setUploadedImage] = useState("https://cdn-icons-png.flaticon.com/512/6596/6596121.png")
  const handleOnChange = (e) => {
    const { name, value } = e.target;
      setData((prev)=>(
        {
          ...prev,
          [name]:value
        }
      ))
  };
  const uploadFile = async(e)=>{
    const file = e.target.files[0];
    setUploadedImage(URL.createObjectURL(file))
    const {secure_url} = await uploadFileIntoCloudinary(file)
    setData((prev)=>{
      return{
        ...prev,
        profile_picture:secure_url
      }
    })
  }

  const handleSubmit = async(e) => {
    e.stopPropagation();
    e.preventDefault();
    await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/register-user`,data).then((response)=>{
      if(response.data.success)
      {
        toast.success(response.data.message)
        setData({
          firstname: '',
          lastname: '',
          gender: '',
          email: '',
          password: '',
          confirmPassword: '',
          profile_picture:null
        })
        navigate('/email')
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
      <h1 className='text-center pb-8 text-3xl font-bold'>Register</h1>
      <form className='max-w-md mx-auto' onSubmit={handleSubmit}>
          <div className='w-full mb-5'>
            <button className=' bg-black rounded-full px-4 py-2 w-[fit-content] text-white' onClick={()=>{setUploadedImage("https://cdn-icons-png.flaticon.com/512/6596/6596121.png")}}>X</button>
            <label htmlFor='avatar' className='flex items-center gap-5 text-white justify-between'>
            <img src={uploadedImage} alt="profile_picture" className='rounded-full cursor-pointer overflow-hidden'  width={100} height={100}/>
              <div className='flex gap-4'>
              <p className=' bg-black px-4 py-2 rounded-lg'>upload</p>
              </div>
            </label>  
            <input type="file" name="avatar" id="avatar" onChange={uploadFile} className='hidden'/>
          </div>
        <div className='grid md:grid-cols-2 md:gap-6'>
          <div className='relative z-0 w-full mb-5 group'>
            <input
              type='text'
              name='firstname'
              id='floating_first_name'
              value={data.firstname}
              onChange={handleOnChange}
              onKeyDown={handleTitleKeyDown}
              onInput={preventSpace}
              className='block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer'
              placeholder=' '
              required
            />
            <label
              htmlFor='floating_first_name'
              className='peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6'
            >
              First name
            </label>
          </div>
          <div className='relative z-0 w-full mb-5 group'>
            <input
              type='text'
              name='lastname'
              id='floating_last_name'
              value={data.lastname}
              onChange={handleOnChange}
              onKeyDown={handleTitleKeyDown}
              onInput={preventSpace}
              className='block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer'
              placeholder=' '
              required
            />
            <label
              htmlFor='floating_last_name'
              className='peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6'
            >
              Last name
            </label>
          </div>
        </div>
        <div className='flex flex-col text-black'>
          <h3 className='mb-4 font-semibold text-gray-500 dark:text-white'>Gender</h3>
          <ul className='items-center w-full text-sm font-medium text-gray-900 rounded-lg sm:flex'>
            <li className='w-full'>
              <div className='flex items-center ps-3'>
                <input
                  id='horizontal-list-radio-male'
                  type='radio'
                  value='male'
                  name='gender'
                  checked={data.gender === 'male'}
                  onChange={handleOnChange}
                  className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600'
                />
                <label
                  htmlFor='horizontal-list-radio-male'
                  className='w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300'
                >
                  Male
                </label>
              </div>
            </li>
            <li className='w-full'>
              <div className='flex items-center ps-3'>
                <input
                  id='horizontal-list-radio-female'
                  type='radio'
                  value='female'
                  name='gender'
                  checked={data.gender === 'female'}
                  onChange={handleOnChange}
                  className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500'
                />
                <label
                  htmlFor='horizontal-list-radio-female'
                  className='w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300'
                >
                  Female
                </label>
              </div>
            </li>
            <li className='w-full'>
              <div className='flex items-center ps-3'>
                <input
                  id='horizontal-list-radio-others'
                  type='radio'
                  value='others'
                  name='gender'
                  checked={data.gender === 'others'}
                  onChange={handleOnChange}
                  className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500'
                />
                <label
                  htmlFor='horizontal-list-radio-others'
                  className='w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300'
                >
                  Others
                </label>
              </div>
            </li>
          </ul>
        </div>
        <div className='relative z-0 w-full mb-5 group'>
          <input
            type='email'
            name='email'
            id='floating_email'
            value={data.email}
            onChange={handleOnChange}
            onKeyDown={handleTitleKeyDown}
            onInput={preventSpace}
            className='block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer'
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
        <div className='relative z-0 w-full mb-5 group'>
          <input
            type='password'
            name='password'
            id='floating_password'
            value={data.password}
            onChange={handleOnChange}
            onKeyDown={handleTitleKeyDown}
            onInput={preventSpace}
            className='block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer'
            placeholder=' '
            required
          />
          <label
            htmlFor='floating_password'
            className='peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6'
          >
            Password
          </label>
        </div>
        <div className='relative z-0 w-full mb-5 group'>
          <input
            type='password'
            name='confirmPassword'
            id='floating_repeat_password'
            value={data.confirmPassword}
            onChange={handleOnChange}
            onKeyDown={handleTitleKeyDown}
            onInput={preventSpace}
            className='block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer'
            placeholder=' '
            required
          />
          <label
            htmlFor='floating_repeat_password'
            className='peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6'
          >
            Confirm password
        </label>
        </div>
        <button
          type='submit'
          className='w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
        >
          Submit
        </button>
        <p className='mt-4'>Already Have an Account ? <Link to={'/email'} className='text-blue-700'>Login</Link> </p>
      </form>
    </div>
  );
};

export default Register;

