import React, { useEffect, useRef, useState } from "react";
import moment from 'moment'
import { useSelector } from "react-redux";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FaPlus, FaImage, FaVideo } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
import Avatar from "./Avatar";
import uploadFileIntoCloudinary from "../config/cloudinaryImageUpload";
import LoadingCircle from "./Loading";
import Chat from "./Chat";

const Message = () => {
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const { userId } = useParams();
  const [uploadModal, setuploadModal] = useState(false);
  const [uploadDetails, setUploadDetails] = useState("");
  const [loading, setLoading] = useState(false);
  const currentMessage = useRef(null)
  const socketConnection = useSelector((state) => state.user.socketConnection);
  const [allMessage,setAllMessage] = useState([]);
  const [chatUserProfile, setChatUserProfile] = useState({
    firstname: "",
    lastname: "",
    profile_picture: "",
    gender: "",
    online: false,
  });

  const [message, setMessage] = useState({
    text: "",
    imageUrl: "",
    videoUrl: "",
  });
  async function handleImageUpload(e) {
    setLoading(true);
    let file = e.target.files[0];
    const { secure_url, public_id } = await uploadFileIntoCloudinary(file);
    setLoading(false);
    setUploadDetails(public_id);
    setMessage((prev) => {
      return {
        ...prev,
        imageUrl: secure_url,
      };
    });
  } 
  async function handleVideoUpload() {
    setLoading(true);
    let file = e.target.files[0];
    const { secure_url, public_id } = await uploadFileIntoCloudinary(file);
    setLoading(false);
    setUploadDetails(public_id);
    setMessage((prev) => {
      return {
        ...prev,
        videoUrl: secure_url,
      };
    });
  }
  function handleInputMessage(e)
  { 
    let value = e.target.value 
    setMessage((prev)=>(
      {...prev,text:value}
    ))
  }
  function HandleSubmit(e){
    e.preventDefault();
    if(message.text || message.videoUrl || message.imageUrl)
    {
      if(socketConnection){
        socketConnection.emit('send-new-message',{
          sender:user?._id,
          receiver:userId,
          text:message.text,
          imageUrl:message.imageUrl,
          messgByUserId:user?._id,
          videoUrl:message.videoUrl
        })
      }
    }
    setMessage(
      {
        text: "",
        imageUrl: "",
        videoUrl: "",
      }
    )
  }
  useEffect(()=>{
      if (currentMessage.current) {
        currentMessage.current.scrollIntoView({ behavior: "smooth", block: 'end' });
      }
  },[currentMessage])
  useEffect(()=>{
    if(socketConnection)
    {
      socketConnection.emit('load-message',{
        sender:user?._id,
        receiver:userId,
      })
      socketConnection?.on('message',(data)=>{
        if(data === null)
        {
          setAllMessage([])

        }
        else
        {setAllMessage(data);
        }
      })
    }
  },[userId])
  useEffect(() => {
    if (user._id === "") {
      navigate("/");
    } else if (user._id !== "" && socketConnection) {
      socketConnection?.emit("message-to-user", userId);
      socketConnection?.on("receiver-details", (data) => {
        setChatUserProfile(data);
      }); 
      socketConnection?.on('message',(data)=>{

        setAllMessage(data);
      })
    }
  }, [socketConnection, userId,user]);
  return (
    <>
      <div className="h-screen overflow-hidden">
        <header className="sticky top-0 h-20 w-full bg-white">
          <div className="w-full flex justify-between items-center h-full px-8">
            <div className="flex justify-center gap-2 items-center h-full">
              <Link to={"/"} className="mr-2">
                <MdKeyboardArrowLeft size={25} />
              </Link>
              <Avatar
                width={50}
                height={50}
                profile_picture={chatUserProfile.profile_picture}
                style={"rounded-xl"}
                firstname={chatUserProfile.firstname}
                lastname={chatUserProfile.lastname}
              />
              <p
                className="capitalize"
                style={{ color: chatUserProfile.online && "green" }}
              >
                {chatUserProfile.firstname} {chatUserProfile.lastname} (
                {chatUserProfile.gender})
              </p>
            </div>
            <div>
              <button className="cursor-pointer">
                <HiOutlineDotsVertical size={30} />
              </button>
            </div>
          </div>
        </header>
        <div className="h-[calc(100vh_-_10rem)] overflow-x-hidden overflow-y-auto my-1">
          <div className="w-full h-full relative">  
            <div className="flex flex-col gap-2 mx-2">
              { (allMessage === null || allMessage.length === 0) && 
                  <div className="flex justify-center">
                    No conversation Yet
                  </div>
              }
            {
              allMessage?.length > 0 && 
              allMessage.map((msg,idx)=>{
                return (
                <div key={idx} ref={currentMessage} className={` px-1 py-1 rounded ${(msg.videoUrl !== ""|| msg.imageUrl !== "")?"w-[40%] min-h-[40vh]":"w-fit"} ${user._id === msg.messgByUserId?" ml-auto bg-green-300":"bg-white"}`}>
                  <Chat msg={msg} key={idx}/>
                  </div>
                )
              })
            }
            {
              // image preview before sending
              message.imageUrl && (
                <div className="p-3  sticky bottom-0 bg-white w-full h-full border border-black flex justify-center">
                  <div className="absolute right-5 w-[30px] flex justify-center items-center h-[30px] bg-slate-300 rounded-full">
                    <IoClose
                      size={20}
                      className="cursor-pointer"
                      onClick={() => {
                        
                        setMessage((prev) => ({ ...prev, imageUrl: "" }));
                        setLoading(false)
                      }}
                    />
                  </div>
                  <img
                    src={message.imageUrl}
                    alt="image-uploaded"
                    className="border-2 rounded-md overflow-hidden border-green-400 object-cover"
                  />
                </div>
              )
            }
            {
              // image preview before sending
              message.videoUrl && (
                <div className="p-3  sticky bottom-0 bg-white w-full h-full border border-black flex justify-center">
                  <div className="absolute right-5 w-[30px] flex justify-center items-center h-[30px] bg-slate-300 rounded-full">
                    <IoClose
                      size={20}
                      className="cursor-pointer"
                      onClick={() => {
                        setMessage((prev) => ({ ...prev, videoUrl: "" }));
                        setLoading(false);
                      }}
                    />
                  </div>
                  <video
                    src={message.imageUrl}
                    alt="video-uploaded"
                    className="aspect-video border-2 rounded-md overflow-hidden border-green-400 object-cover"
                    controls
                    muted
                    autoPlay
                  />
                </div>
              )
            }
            {loading && (
              <div className="w-full h-full sticky bottom-0 flex justify-center">
                <LoadingCircle />
              </div>
            )}
            </div>
          </div>
        </div>
        <div className="h-20 w-full bg-white flex items-center">
          <div className="relative h-full">
            <button
              className="h-full flex justify-center items-center ml-6"
              onClick={(e) => setuploadModal((prev) => !prev)}
            >
              <FaPlus size={26} className="hover:text-slate-500" />
            </button>
            {uploadModal && (
              <div className="bg-white shadow rounded absolute bottom-[90px] px-2 py-3 left-2">
                <form className="flex flex-col gap-3">
                  <label
                    htmlFor="uploadImage"
                    className="flex justify-center items-center gap-3 cursor-pointer hover:bg-slate-300 p-2"
                  >
                    <div>
                      <FaImage size={25} color="green" />
                    </div>
                    <p className="text-[18px] text-cyan-500">Image</p>
                  </label>
                  <label
                    htmlFor="uploadImage"
                    className="flex justify-center items-center gap-3  cursor-pointer hover:bg-slate-300 p-2"
                  >
                    <div>
                      <FaVideo size={25} color="green" />
                    </div>
                    <p className="text-[18px] text-cyan-500">Video</p>
                  </label>
                  <input
                    type="file"
                    id="uploadImage"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <input
                    type="file"
                    id="uploadImage"
                    onChange={handleVideoUpload}
                    className="hidden"
                  />
                </form>
              </div>
            )}
          </div>
          <form className="w-[60%] ml-6 mr-4 flex gap-4" onSubmit={HandleSubmit}>
            <input type="text" 
            placeholder="Type here ..."
            className="py-1 px-3 w-full rounded-md"
            value={message.text}
            onChange={handleInputMessage}
            />
          <div>
           <button className="px-3 py-2 bg-green-400 rounded-lg">send</button>
          </div>
        </form>
        </div>
      </div>
    </>
  );
};

export default Message;
