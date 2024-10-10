import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { logout, setOnlineStatus, setSocketConnection, setUser } from "../redux/userSlice";
import { Sidebar } from "../components/Sidebar";
import { io } from "socket.io-client";

const Home = () => {
  const user = useSelector((state) => state.user);
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // const onlineStatus = useSelector(state => state?.user?.onlineStatus)
  const getTokenFromLocalStorage = localStorage.getItem("token");
  const fetchUserDetail = async () => {
    try {
      const URL = `${import.meta.env.VITE_BACKEND_URL}/api/user-details`;
      const response = await axios.get(URL, {
        withCredentials: true,
      });
      if (response?.data.logout) {
        dispatch(logout());
        navigate("/email", {
          state: "",
        });
      }
      if (response?.data.success) {
        dispatch(setUser(response?.data?.data));
        toast.success(response?.data.message);
      } else {
        toast.error(response?.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  useEffect( () => {
     fetchUserDetail();
  }, []);


  useEffect(() => {
    const socket = io(`${import.meta.env.VITE_BACKEND_URL}`, {
      auth: {
        token: getTokenFromLocalStorage,
      },
    });
      socket.on("online-user-status", (data) => {
        dispatch(setOnlineStatus(data));
      });    
      dispatch(setSocketConnection(socket))
    return () => { 
      socket.disconnect();
    };
  }, []);

  const RegisterORLogin = () => {
    return (
      <div className="absolute top-1/2 left-[60%] -translate-x-1/2 -translate-y-1/2 flex gap-10 flex-col">
        <div>
          <h3 className="text-center text-red-500 text-2xl">
            You are Logged out
          </h3>
        </div>
        <div className="flex gap-5">
          <Link to={"/register"}>
            <span className="px-4 py-2 text-[30px] bg-black rounded-2xl text-white">
              Register
            </span>
          </Link>
          <Link to={"/email"}>
            <span className="px-4 py-2 text-[30px] border boder-1 border-black rounded-2xl">
              Login
            </span>
          </Link>
        </div>
      </div>
    );
  };
  const NoneToShow = () => {
    return (
      <>
        <h1>Nothing to show</h1>
      </>
    );
  };

  let pathname = location.pathname;

  return (
    <>
      <div className="grid lg:grid-cols-[300px,1fr] h-screen max-h-screen">
        <Sidebar />
        <section className="bg-zinc-300">
          {pathname === "/" ? (
            user.firstname === "" ? (
              <>
                <RegisterORLogin />
              </>
            ) : (
              <NoneToShow />
            )
          ) : (
            <>
              <Outlet />
            </>
          )}
        </section>
      </div>
    </>
  );
};

export default Home;
