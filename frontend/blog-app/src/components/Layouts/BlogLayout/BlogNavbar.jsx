import React, { useState } from "react";
import logo from "../../../assets/logo.png";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";
import { Link } from "react-router-dom";
import { LuSearch } from "react-icons/lu";
import { BLOG_NAVBAR_DATA } from "../../../utils/data.js";
import SideMenu from "../SideMenu.jsx";

const BlogNavbar = ({ activeMenu }) => {
  const [openSideMenu, setOpenSideMenu] = useState(false);
  const [openSearchBar, setOpenSearchBar] = useState(false);
  const [openAuthForm,setOpenAuthForm] =useState(false);

  return (
    <div className="bg-white border-b border-gray-200/60 backdrop-blur-sm py-4 px-6 md:px-8 sticky top-0 z-30 shadow-sm">
      
      <div className="container mx-auto flex items-center justify-between gap-6">
        
        <div className="flex items-center gap-5">
          <button
            className="block lg:hidden text-black hover:text-sky-600 transition-colors -mt-1"
            onClick={() => setOpenSideMenu(!openSideMenu)}
          >
            {openSideMenu ? (
              <HiOutlineX className="text-2xl" />
            ) : (
              <HiOutlineMenu className="text-2xl" />
            )}
          </button>

          <Link to="/" className="flex items-center">
            <img src={logo} alt="logo" className="h-6 md:h-7 object-contain" />
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-10">
        <ul className="hidden md:flex items-center gap-10">
  {BLOG_NAVBAR_DATA.map((item, index) => {
    if (item?.onlySideMenu) return null;

    return (
      <li key={item.id}>
        <Link to={item.path} className="relative group text-sm font-medium text-gray-800 tracking-wide">
          {item.label}
          <span className={`absolute inset-x-0 -bottom-1 h-[2px] bg-sky-500 transition-transform duration-300 origin-left ${
            index === 0 ? "scale-x-100" : "scale-x-0"
          } group-hover:scale-x-100`} />
        </Link>
      </li>
    );
  })}
</ul>

        </nav>

        <div className="flex items-center gap-6">
          <button
            className="hover:text-sky-600 transition-colors cursor-pointer"
            onClick={() => setOpenSearchBar(true)}
          >
            <LuSearch className="text-[22px]" />
          </button>

          <button
            className="flex items-center justify-center gap-3 bg-gradient-to-r from-sky-500 to-cyan-400 text-xs md:text-sm font-semibold text-white px-5 md:px-7 py-2 rounded-full transition-all duration-200 cursor-pointer hover:shadow-xl hover:shadow-cyan-200 hover:scale-[1.02]"
            onClick={() => setOpenAuthForm(true)}
          >
            Login / Signup
          </button>
        </div>

        {openSideMenu && (
          <div className="fixed  top-[61px]  -ml-4 bg-white ">
            <SideMenu activeMenu={activeMenu} isBlogMenu />
          </div>
        )}

      </div>
    </div>
  );
};

export default BlogNavbar;
