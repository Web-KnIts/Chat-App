import React, { useEffect } from 'react'
import Avatar from './Avatar'
import {Link, useNavigate} from 'react-router-dom'
import { useSelector } from 'react-redux'
const UserSearchCard = ({user,onClose}) => {
    const onlineUsers = useSelector(state =>state?.user?.onlineStatus)
    const userProfile = useSelector(state => state?.user)
    const navigate = useNavigate();
    const handleRoute = ()=>{
        onClose(false);
        if(userProfile._id !== user._id)
        {
        navigate(`/${user._id}`)
        }
        else 
        {
            navigate('/')
        }
    }
    const isOnLine = onlineUsers.includes(user._id)
  return (
    <div className='flex justify-start items-center gap-4 border-b-[1px] pb-3 border-zinc-500' onClick={handleRoute} style={{backgroundColor:`${isOnLine?"limegreen":"transparent"}`}}>
        <div className=''>
            <Avatar firstname={user.firstname} lastname={user.lastname} profile_picture={user.profile_picture} width={60} height={60} style={''}/>
        </div>
        <div>
            <div className='font-semibold capitalize'>
                {user.firstname} {user.lastname} ({user.gender})
            </div>
            <div className='font-medium'>
                {user.email}
            </div>
        </div>
    </div>
  )
}

export default UserSearchCard