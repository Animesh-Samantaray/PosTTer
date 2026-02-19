import React, { useContext } from "react";
import { BLOG_NAVBAR_DATA, SIDE_MENU_DATA } from "../../utils/data";
import { LuLogOut, LuX } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import CharAvatar from "../Cards/CharAvatar";
import { UserContext } from "../../context/userContext";

const SideMenu = ({
  activeMenu,
  isBlogMenu,
  setOpenSideMenu,
  openSideMenu,
}) => {
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);

  const menuData = isBlogMenu ? BLOG_NAVBAR_DATA : SIDE_MENU_DATA;

  const handleClick = (route) => {
    if (route === "logout") {
      handleLogout();
      return;
    }

    navigate(route);
    setOpenSideMenu(false); // always close on mobile click
  };

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    setOpenSideMenu(false);
    navigate("/");
  };

  return (
    <>
      {/* ===== Mobile Backdrop ===== */}
      {openSideMenu && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setOpenSideMenu(false)}
        />
      )}

      {/* ===== Sidebar ===== */}
      <div
        className={`
          fixed lg:sticky top-[61px] left-0 z-50
          h-[calc(100vh-61px)] w-72 max-w-[85vw]
          bg-white border-r border-gray-200
          transform transition-transform duration-300 ease-in-out
          flex flex-col
          
          ${openSideMenu ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >
        {/* ===== Mobile Header ===== */}
        <div className="flex items-center justify-between p-4 border-b lg:hidden">
          <h3 className="font-semibold">Menu</h3>
          <button
            onClick={() => setOpenSideMenu(false)}
            className="p-2 rounded hover:bg-gray-100"
          >
            <LuX className="text-xl" />
          </button>
        </div>

        {/* ===== User Card ===== */}
        {user && (
          <div className="flex flex-col items-center gap-2 px-5 pt-5 pb-6 border-b">
            {user?.profileImageUrl ? (
              <img
                src={user.profileImageUrl}
                alt="profile"
                className="w-20 h-20 rounded-full object-cover bg-slate-200"
              />
            ) : (
              <CharAvatar
                fullName={user?.name || " "}
                width="w-20"
                height="h-20"
                style="text-xl"
              />
            )}

            <div className="text-center">
              <h5 className="font-semibold text-gray-900">
                {user?.name}
              </h5>
              <p className="text-xs text-gray-600 break-all">
                {user?.email}
              </p>
            </div>
          </div>
        )}

        {/* ===== Menu Items ===== */}
        <div className="flex-1 overflow-y-auto p-3">
          {menuData.map((item, index) => {
            const isActive = activeMenu === item.label;

            return (
              <button
                key={`menu_${index}`}
                onClick={() => handleClick(item.path)}
                className={`
                  w-full flex items-center gap-4 text-sm
                  px-4 py-3 rounded-xl mb-2
                  transition-all duration-200
                  
                  ${
                    isActive
                      ? "text-white bg-gradient-to-r from-sky-500 to-cyan-400 shadow"
                      : "text-gray-700 hover:bg-gray-100"
                  }
                `}
              >
                <item.icon className="text-lg shrink-0" />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* ===== Logout ===== */}
        {user && (
          <div className="p-3 border-t">
            <button
              onClick={handleLogout}
              className="
                w-full flex items-center gap-4 text-sm
                px-4 py-3 rounded-xl
                text-rose-600 hover:bg-rose-50
                transition
              "
            >
              <LuLogOut className="text-lg" />
              Logout
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default SideMenu;
