import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    _id:"",
    firstname:"",
    lastname:"",
    email:"",
    gender:"",
    bio:"",
    profile_picture:"",
    accessToken:"",
    onlineStatus:[],
    socketConnection:null
}

export const userSlice = createSlice({
    name:'User',
    initialState,
    reducers:{
        setUser : (state,action)=>{
            state._id = action.payload._id,
            state.email = action.payload.email,
            state.firstname = action.payload.firstname,
            state.lastname = action.payload.lastname,
            state.profile_picture = action.payload.profile_picture,
            state.gender = action.payload.gender,
            state.bio = action.payload.bio

        },
        setToken : (state,action)=>{
            state.accessToken = action.payload
        },
        logout:(state,action)=>{
            state._id = "",
            state.email = "",
            state.firstname = "",
            state.lastname = "",
            state.profile_picture = "",
            state.token = "",
            state.bio = "",
            state.gender = "",
            state.socketConnection = null
        },
        setOnlineStatus:(state,action)=>{
            state.onlineStatus = action.payload
        },
        setSocketConnection:(state,action)=>{
            state.socketConnection = action.payload
        }
    },
})

export const {setUser,setToken,logout,setOnlineStatus,setSocketConnection} = userSlice.actions;
export default userSlice.reducer