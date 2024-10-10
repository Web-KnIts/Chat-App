import React, { useEffect, useState } from 'react'
import {IoSearchOutline} from 'react-icons/io5'
import LoadingCircle from './Loading';
import UserSearchCard from './UserSearchCard';
import axios from 'axios';
import toast from 'react-hot-toast';
import { preventSpace } from '../pages/Register';

const SearchComponent = ({onClose}) => {
    const [searchUser,setSearchUser] = useState([]);
    const [loading,setLoading] = useState(false);
    const [searchData,setSearchData] = useState('')
    
    const handleEnter = (e) => {
            if(e.keyCode === 13)
            {
                handleSearchUser();
            }
        }

    const handleSearchUser = async()=>{
        try
        {
            setLoading(true)
            const URL = `${import.meta.env.VITE_BACKEND_URL}/api/get-all-user-details`
            const response = await axios.post(URL,{search:searchData})
            if(response.data.success)
            {
                setSearchUser(response?.data?.data)
                setLoading(false)
            }
            else
            {
                setLoading(false)
                setSearchData([])
                searchData('')
            }
            setLoading(false)
        }
        catch(err)
        {
            toast.error("Something went wrong")
            searchData('')
            setLoading(false)
        }
    }

    useEffect(()=>{
        handleSearchUser
    },[searchData])

  return (
    <div className='fixed top-0 bottom-0 left-0 right-0 z-10 backdrop-blur-md'>
        <div className='w-full max-w-lg mx-auto mt-16'>
            <div className='bg-white rounded h-14 overflow-hidden flex '>
                    <input type="text"
                    value={searchData}
                    onChange={(e)=>setSearchData(e.target.value)}
                    placeholder='Search user by name,email ...' 
                    className='w-full outline-none py-1 h-full px-4'
                    onKeyDown={handleEnter}
                    onInput={preventSpace}
                    /> 
                    <div className='h-14 w-14 flex justify-center items-center'>
                        <IoSearchOutline size={25}/>
                    </div>
                    <div className='bg-black text-white cursor-pointer font-bold h-14 w-14 flex justify-center items-center' onClick={(e)=>onClose(false)}>X</div>
            </div>
        <div className='bg-white mt-2 w-full p-4 rounded'>
            {
                (searchUser.length === 0)  && !loading && <h1 className='text-black'>No user</h1>
            }
            {
            loading && (
                <p><LoadingCircle/></p>
            )             
            }
            <div>
            {
                (searchUser.length !== 0)  && !loading && (
                    searchUser.map((item,index)=>{
                        return (
                             <UserSearchCard key={item._id} user={item} onClose={onClose}/>
                        )
                    })
                )
            }
            </div>
        </div>
        </div>
    </div>
  )
}

export default SearchComponent