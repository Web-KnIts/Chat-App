import React from "react";

const AuthLayout = ({children}) => {
  return (
    <>
      <header className="w-full h-[60px] flex justify-center items-center bg-zinc-900 py-5 shadow-md">
        <h1 className="text-4xl text-green-400 ">Logo Chat App</h1>
      </header>
      {children}
    </>
  );
};

export default AuthLayout;
