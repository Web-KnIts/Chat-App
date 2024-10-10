import React, { useState } from 'react'
import moment from 'moment'
import { IoMdArrowDropdown } from "react-icons/io";
import { IoMdArrowDropup } from "react-icons/io";
const Chat = ({msg}) => {
    const [showDateAndTime,setShowDateAndTime] = useState(false)
  return (
    <>
     <div className="w-full">
                      {msg?.videoUrl && <video src={msg.videoUrl} className="p-2 aspect-video" controls muted/>}
                      {msg?.imageUrl && <img src={msg.imageUrl} className="p-2"/>}
                  </div>
                  <div className="flex gap-3">
                    <p className="px-2 max-w-[30vw] break-all">{msg.text}</p>
                    <span className="" onClick={(e)=>setShowDateAndTime((prev)=>!prev)}>{showDateAndTime?<IoMdArrowDropup/>:<IoMdArrowDropdown/>}</span>
                  </div>
                    {
                      showDateAndTime &&
                      <>
                      <p className="text-right text-[12px]">{moment(msg.createdAt).format('LT')}</p>
                      <p className="text-right text-[12px]">{moment(msg.createdAt).format('LL')}</p>
                      </> 
                    }
    </>
  )
}

export default Chat