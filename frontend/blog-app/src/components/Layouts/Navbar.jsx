import React, { useState } from "react";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";
import SideMenu from "./SideMenu";
import ProfileInfoCard from "../Cards/ProfileInfoCard";

const Navbar = ({ activeMenu }) => {
  const [openSideMenu, setOpenSideMenu] = useState(false);

  return (
    <>
      {/* ===== NAVBAR ===== */}
      <div className="bg-white border-b border-gray-200/60 backdrop-blur-sm py-4 px-6 md:px-8 sticky top-0 z-30 shadow-sm">
        <div className="container mx-auto flex items-center justify-between gap-6">

          {/* LEFT */}
          <div className="flex items-center gap-5">
            <button
              className="block lg:hidden text-black hover:text-sky-600 transition-colors"
              onClick={() => setOpenSideMenu(!openSideMenu)}
            >
              {openSideMenu ? (
                <HiOutlineX className="text-2xl" />
              ) : (
                <HiOutlineMenu className="text-2xl" />
              )}
            </button>

            <Link to="/admin/dashboard" className="flex items-center">
              <img
                src={logo}
                alt="logo"
                className="h-6 md:h-7 object-contain"
              />
            </Link>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-4">
            <ProfileInfoCard />
          </div>
        </div>
      </div>

      {/* ===== MOBILE SIDE MENU ===== */}
      {openSideMenu && (
        <div className="fixed top-[61px] left-0 bg-white shadow-md z-40">
          <SideMenu
            activeMenu={activeMenu}
            setOpenSideMenu={setOpenSideMenu}
            isAdminMenu
          />
        </div>
      )}
    </>
  );
};

export default Navbar;
