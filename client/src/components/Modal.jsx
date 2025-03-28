import React, { useEffect, useState } from 'react'
import Avatar from './Avatar'
import { useDispatch, useSelector } from 'react-redux'
import { handleTitleKeyDown, preventSpace } from '../pages/Register'
import toast from 'react-hot-toast'
import axios from 'axios'
import { setUser } from '../redux/userSlice'

function Modal({isOpen,onCloseModal,data}) {
    // function createPattern(str){
    //     let result="",i,j;
        
    //     for(i = 0;i<=2;i++)
    //     {
    //         for(j=0;j<20;j++)
    //         {
    //             if(i === 0 || j === 0)
    //             {
    //                 result+="+"
    //             }
    //             else if(i === 1)
    //             {
    //                 result+=str
    //                 result+="+"
    //                 break;
    //             }
    //             else
    //             {
    //                 result+='-'
    //             }
    //         }
    //         result+='\n';
    //     }
    //    return result
    // }
    const [isEdit,setIsEdit] = useState(false)
    const [profileData,setProfileData] = useState(data)
    const dispatch = useDispatch();
    useEffect(()=>{
      setProfileData((preve)=>{
       return{
        ...preve,
        ...data
       }
      })
    },[data])
    const handleOnChangeData = (e)=>{
      const {name,value} = e.target
      setProfileData((prev)=>{
        return {
          ...prev,
          [name]:value
        }
      })
    }

    const handleCancel = (e)=>{
      e.preventDefault();
      setProfileData(data)
      setIsEdit(false)
    }

    const handelSubmitData = async(e)=>{
      e.preventDefault();
      toast.success('Updating ....')
      const URL = `${import.meta.env.VITE_BACKEND_URL}/api/update-user-details`
      
      try
      {
        const prepareNewProfileObject = {
          firstname:profileData.firstname,
          lastname:profileData.lastname,
          profile_picture:profileData.profile_picture,
          bio:profileData.bio,
          gender:profileData.gender
        }
        const response = await axios.post(URL,prepareNewProfileObject,{
          withCredentials:true
        })
        console.log("data",response.data);
        if(response?.data.success)
        {
          toast.success(response.data.message)
          dispatch(setUser(response?.data?.data))
        }
        else
        {
          toast.error(response.data.message)
        }
      }catch(error)
      {
        toast.error(error.message)
        console.log(error)
      }
      setIsEdit(false)
    }
  return (
    <div className={`absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 w-full h-full z-[3] flex justify-center items-center bg-[#00000048] transition-opacity duration-300 ${
        isOpen ? 'opacity-100': 'opacity-0'
      }`}>
        <div className='bg-white p-8 m-1 w-full max-w-sm flex flex-col rounded-2xl relative'>
            <button className='absolute right-5 top-3 flex justify-center items-center w-5 h-5 p-4 bg-black text-white rounded-full' onClick={()=>onCloseModal(false)}>X</button>
            <h1 className='text-3xl text-center text-gray-500 font-bold mb-4'>{isEdit?"Edit Profile":"Profile"} </h1>
           {!isEdit && <p className='text-lg flex gap-9 justify-end'><button className='bg-black text-white px-4 py-1 rounded-xl text-[14px]' onClick={()=>setIsEdit(true)}>Edit</button></p>}
            <form className='grid gap-3 mt-3' onSubmit={handelSubmitData} method='post'>
              <div className='flex justify-center items-center flex-col'>
              <label htmlFor="avatar">
                <Avatar  firstname={profileData?.firstname} lastname={profileData?.lastname} profile_picture={profileData?.profile_picture} width={100} height={100} style={''}/>
               {/* {isEdit && <p className='bg-black text-white mt-2 px-4 py-1 rounded-lg text-center'>uplaod</p>} */}
              </label>
              {/* {isEdit && <input type="file" name="avatar" id="avatar" className='hidden' accept='image/*' disabled={!isEdit} />} */}
              </div>
              <div className='flex flex-col'>
              <div className='flex flex-col gap-2'>
              <label htmlFor="firstname" className='capitalize text-black font-bold px-2'>Firstname : </label>
              <input className='capitalize w-full py-1 border-[3px]  px-2 rounded-2xl border-green-500 focus:outline-green-800' type="text" name='firstname' id='firstname'  onKeyDown={handleTitleKeyDown} onInput={preventSpace} value={profileData.firstname} disabled={!isEdit} onChange={(e)=>handleOnChangeData(e)}/>                    
              </div>
              <div className='flex flex-col gap-2'>
              <label htmlFor="lastname" className='capitalize text-black font-bold px-2'>lastname : </label>
              <input className='capitalize w-full py-1 border-[3px]  px-2 rounded-2xl border-green-500 focus:outline-green-800' type="text" name='lastname' id='lastname'  onKeyDown={handleTitleKeyDown} onInput={preventSpace} value={profileData.lastname} disabled={!isEdit} onChange={(e)=>handleOnChangeData(e)}/>                    
              </div>
              </div>
              <div className='flex flex-col gap-2'>
                   {
                    !isEdit && <>
                       <label htmlFor="gender" className='capitalize text-black font-bold px-2'>Gender : </label>
                       <input className='capitalize w-full py-1 border-[3px]  px-2 rounded-2xl border-green-500 focus:outline-green-800' type="text" name='gender' id='gender'  value={profileData.gender} disabled={!isEdit} />
                    </> 
                   }
                   {
                    isEdit && <div className='flex flex-col justify-around'>
                      <label htmlFor="" className='capitalize text-black font-bold px-2'>Gender : </label>
                        <div className='flex justify-around border-[3px]  px-2 rounded-2xl border-green-500 focus:outline-green-800'>
                        <div>
                      <input type="radio" id='male' name='gender' value={'male'} checked={profileData.gender === 'male'} onChange={(e)=>handleOnChangeData(e)}/>
                      <label htmlFor="" className='ml-2'>Male</label>
                      </div>
                      <div>
                      <input type="radio" id='female' name='gender' value={'female'} checked={profileData.gender === 'female'} onChange={(e)=>handleOnChangeData(e)}/>
                      <label htmlFor="" className='ml-2'>Female</label>
                    </div>
                      <div>
                    <input type="radio" id='others' name='gender' value={'others'} checked={profileData.gender === 'others'} onChange={(e)=>handleOnChangeData(e)}/>
                    <label htmlFor="" className='ml-2'>Others</label>
                      </div>
                        </div>
                      </div>
                   }
              </div>
              <div className='flex flex-col gap-2'>
              <label htmlFor="bio" className='capitalize text-black font-bold px-2'>Bio : </label>
              <input className='capitalize w-full py-1 border-[3px]  px-2 rounded-2xl border-green-500 focus:outline-green-800' type="text" name='bio' id='bio' onKeyDown={handleTitleKeyDown} onInput={preventSpace} value={profileData.bio} disabled={!isEdit} onChange={(e)=>handleOnChangeData(e)}/>
              </div>
              <div className='flex flex-col gap-2'>
              <label htmlFor="email" className='capitalize text-black font-bold px-2'>email : </label>
              <input className=' w-full py-1 border-[3px]  px-2 rounded-2xl border-green-500 focus:outline-green-800' type="text" name='email' id='email' onKeyDown={handleTitleKeyDown} onInput={preventSpace} value={profileData.email} disabled={true} onChange={(e)=>handleOnChangeData(e)}/>
              </div>
              {
                isEdit && <>
                   <button className='w-full bg-red-500 text-white py-2 rounded-lg mt-5' onClick={handleCancel}>Cancel</button>
                  <button type='submit'>Submit</button>
                </>
              }
            </form>
        </div>
      </div>
  )
}
export default React.memo(Modal)