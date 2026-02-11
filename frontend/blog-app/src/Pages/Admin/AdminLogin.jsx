import React, { useState } from "react";
import logo from "../../assets/logo.png";
import Login from "../../components/Auth/Login";
import SignUp from "../../components/Auth/SignUp";

const AdminLogin = () => {
  const [currentPage, setCurrentPage] = useState("login");

  return (
    <>
      {/* HEADER */}
      <div className="fixed top-0 left-0 w-full h-[67px] flex  bg-white items-center z-20">
        <div className="px-6">
          <img src={logo} alt="logo" className="h-8 w-auto" />
        </div>
      </div>

      {/* PAGE BODY */}
      <div className="min-h-screen pt-[67px] bg-gray-50 flex items-center justify-center px-4">
        {/* SINGLE WHITE CARD */}
        <div
          className="
            w-full
            max-w-5xl
            bg-white
            rounded-2xl
            shadow-xl shadow-gray-200/70
            overflow-hidden

            min-h-[520px]
            lg:min-h-[720px]
          "
        >
          {currentPage === "login" ? (
            <Login setCurrentPage={setCurrentPage} />
          ) : (
            <SignUp setCurrentPage={setCurrentPage} />
          )}
        </div>
      </div>
    </>
  );
};

export default AdminLogin;
