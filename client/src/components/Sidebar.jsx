import React, { useEffect, useState } from "react";
import { AiFillMessage } from "react-icons/ai";
import { LuUserPlus } from "react-icons/lu";
import { CiLogout } from "react-icons/ci";
import { Link, NavLink } from "react-router-dom";
import Avatar from './Avatar'
import { useDispatch, useSelector } from "react-redux";
import Modal from "./Modal";
import { logout } from "../redux/userSlice";
import SearchComponent from "./SearchComponent";
export const Sidebar = () => {
    const user = useSelector(state => state.user)
    const dispatch = useDispatch();
    const [profileModal,setProfileModal] = useState(false);
    const [allUser,setAllUser] = useState([]);
    const [openSearch,setOpenSearch] = useState(false)
    const socketConnection = useSelector((state) => state.user.socketConnection);
    const onlineUsers = useSelector(state =>state?.user?.onlineStatus)
    useEffect(()=>{
      if(socketConnection)
      {
        socketConnection.emit('sidebar',user._id)
        socketConnection.on('conversation',(data)=>{
          const conversationUserData = data.map((Convouser,idx)=>{
            const obj = {
              sender:Convouser.sender,
              receiver:Convouser.receiver
            }
            // if(Convouser?.sender._id === Convouser.receiver._id)
            // {
            //   console.log('sender : ',Convouser.sender)
            //   return {
            //     ...Convouser,
            //     userDetails:Convouser.sender,
            //   }
            // }
            if(Convouser?.receiver._id !== user._id)
            {
              return {
                ...Convouser,
                userDetails:obj.receiver,
              }
            }
            else
            {
              return {
                ...Convouser,
                userDetails:obj.sender,
              }
            }
          })
          setAllUser(conversationUserData);
        })
      }
    },[user,socketConnection])

    const logoutUser = (e)=>{
      // dispatch(logout(""))
    }


  return (
    <>
    <div className="w-full h-full">
    <div className="w-full h-full grid grid-cols-[48px,1fr] gap-x-5">
      <div className="bg-slate-100 w-12 h-full flex flex-col re justify-between rounded-tr-lg rounded-br-lg py-5 text-green-500">
        <div>
          <NavLink
            className={({ isActive }) =>
              `w-14 h-14 flex justify-center items-center cursor-pointer hover:bg-slate-200 rounded-md ${
                isActive && "bg-slate-200"
              }`
            }
            title="chat"
          >
            <AiFillMessage size={30} />
          </NavLink>
          <div
            className="w-14 h-14 flex justify-center items-center cursor-pointer hover:bg-slate-200 rounded-md"
            onClick={(e)=>setOpenSearch(true)}
            title="Add Friend"
          >
            <LuUserPlus size={30} />
          </div>
        </div>
        <div className="w-full mx-auto flex flex-col items-center">
          {
            user.firstname?(
              <>
              <button className="mx-auto" onClick={()=>setProfileModal(true)}>
              <Avatar profile_picture={user?.profile_picture} src={user?.profile_picture} firstname={user?.firstname} lastname={user?.lastname} width={38} height={38} style={'rounded-full'}/>
                {/* <img src={user.profile_picture}   alt="" className="w-[35px] h-[35px] rounded-full" /> */}
            </button>
          <button className="w-14 h-14 flex justify-center items-center cursor-pointer hover:bg-slate-200 rounded-md" onClick={(e)=>logoutUser(e)}>
            <CiLogout size={30} />
          </button>
              </>
            ):(" ")
          }
        </div>
      </div>
      {user.firstname && <div className="w-full min-h-full overflow-y-scroll">
       <div className="w-full relative">
       <h1 className="text-2xl text-right pr-5 py-2">Friends</h1>
       <div className="w-[50%] h-1 bg-black absolute right-5 rounded-xl z-[1]"/>
       <div className="w-[50%] h-1 bg-red-500 absolute right-6 -bottom-[2px] rounded-xl z-[2]"/>
       </div>
       <div className="w-full h-full relative  scrollbar py-5">
          {
            (allUser.length === 0 ) && <h1 className="absolute top-[30%] left-5 text-3xl text-zinc-600">None to message</h1>
          }
          { 
            allUser.map((conv,idx)=>{
              const isOnLine = onlineUsers.includes(conv?.receiver._id)
              const lastMssg = conv?.lastMsg.text.slice(0,5) + " ..."
              console.log(lastMssg)
              return (
                <NavLink to={`/${conv.userDetails._id}`} className={({ isActive, isPending }) =>
                  isPending ? "min-h-14" : isActive ? "text-red-700 min-h-14" : "min-h-14"
                }>
                <div key={conv._id} className="border-t border-b py-1"  style={{backgroundColor:`${isOnLine?"limegreen":"transparent"}`}}>
                  <div className="flex gap-2 items-center">
                    <Avatar firstname={conv?.userDetails.firstname} lastname={conv?.userDetails.lastna} profile_picture={conv?.userDetails.profile_picture} width={60} height={60} style={'rounded-full'}/>
                    <div className="flex flex-col items-center justify-end">
                    <h3 className="text-[16px] font-semibold capitalize">{conv?.userDetails.firstname} {conv?.userDetails.lastname}</h3>
                    <span>{lastMssg} {}</span>
                    </div>
                  </div>
                </div>
                </NavLink>
              )
            })
          } 
       </div>
      </div>}
    </div>
      {profileModal && <Modal onCloseModal={setProfileModal} isOpen={profileModal} data={user}/>}
        { openSearch && (
          <SearchComponent onClose={setOpenSearch}/>
        )}
    </div>
    </>
  );
};
