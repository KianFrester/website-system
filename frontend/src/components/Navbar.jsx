import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";
import LoadingScreen from "./LoadingScreen";
import {
  FaHome,
  FaBed,
  FaEnvelope,
  FaInbox,
  FaEdit,
  FaChartBar,
  FaCalendarAlt,
  FaSignOutAlt,
  FaSignInAlt,
  FaUserPlus,
} from "react-icons/fa";

const NavLink = ({ path, label, icon, isActive, onClick }) => (
  <Link
    to={path}
    onClick={onClick}
    className={`flex items-center gap-2 text-white font-medium text-[1.05rem] tracking-wide transition-colors relative after:content-[''] after:absolute after:w-0 after:h-0.5 after:bg-teal-600 after:left-0 after:-bottom-1.5 after:transition-all after:duration-300 hover:after:w-full ${
      isActive ? "text-teal-600 after:w-full" : "hover:text-teal-600"
    }`}
  >
    <span className="text-lg">{icon}</span>
    {label}
  </Link>
);

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { session, signOut, roles } = UserAuth();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);
  const isActive = (path) => location.pathname === path;

  const isLoggedIn = !!session;

  const handleLogout = async () => {
    setLoading(true);
    await signOut();
    setTimeout(() => {
      setLoading(false);
      navigate("/");
    }, 500);
  };

  let routes;

  if (!isLoggedIn) {
    routes = [
      { path: "/", label: "Home", icon: <FaHome /> },
      { path: "/rooms", label: "Rooms", icon: <FaBed /> },
      { path: "/contact", label: "Contact", icon: <FaEnvelope /> },
    ];
  } else if (roles.includes("admin")) {
    routes = [
      { path: "/inbox", label: "Inbox", icon: <FaInbox /> },
      { path: "/rooms", label: "Rooms", icon: <FaBed /> },
      { path: "/edit-rooms", label: "Edit Rooms", icon: <FaEdit /> },
      { path: "/dashboard", label: "Dashboard", icon: <FaChartBar /> },
    ];
  } else if (roles.includes("user")) {
    routes = [
      { path: "/rooms", label: "Rooms", icon: <FaBed /> },
      { path: "/contact", label: "Contact", icon: <FaEnvelope /> },
      { path: "/booking", label: "Booking", icon: <FaCalendarAlt /> },
      { path: "/my-booking", label: "My Bookings", icon: <FaCalendarAlt /> },
    ];
  } else {
    routes = [
      { path: "/", label: "Home", icon: <FaHome /> },
      { path: "/rooms", label: "Rooms", icon: <FaBed /> },
      { path: "/contact", label: "Contact", icon: <FaEnvelope /> },
    ];
  }

  return (
    <>
      {loading && <LoadingScreen />}
      <nav className="flex justify-between items-center px-[5%] py-5 bg-gradient-to-r from-black/70 via-black/50 to-black/70 text-white shadow-md sticky top-0 z-50">
        <Link
          to="/"
          className="flex items-center cursor-pointer hover:opacity-90 transition-opacity"
        >
          <div className="w-10 h-10 mr-3">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full"
            >
              <path
                d="M12 2L3 7V17L12 22L21 17V7L12 2Z"
                fill="#ffffff"
                stroke="#2d5753"
                strokeWidth="1.5"
              />
              <path
                d="M12 6L7 9V15L12 18L17 15V9L12 6Z"
                fill="white"
                stroke="#4f9a94"
                strokeWidth="1"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-wide font-playfair">
            Hotel Booking System
          </h1>
        </Link>

        <button className="lg:hidden p-2.5 z-[101]" onClick={toggleSidebar}>
          <div className="w-7.5 h-0.75 bg-white relative before:content-[''] before:absolute before:w-7.5 before:h-0.75 before:bg-white before:-translate-y-2.5 before:transition-all before:duration-300 after:content-[''] after:absolute after:w-7.5 after:h-0.75 after:bg-white after:translate-y-2.5 after:transition-all after:duration-300"></div>
        </button>

        <div className="hidden lg:flex items-center">
          <div className="flex gap-7">
            {routes.map(({ path, label, icon }) => (
              <NavLink
                key={path}
                path={path}
                label={label}
                icon={icon}
                isActive={isActive(path)}
              />
            ))}
          </div>

          <div className="flex gap-4 ml-8">
            {isLoggedIn ? (
              <button
                onClick={() => {
                  handleLogout();
                  closeSidebar();
                }}
                className="flex items-center gap-2 px-5 py-2.5 rounded bg-red-600 text-white font-medium text-[0.95rem] tracking-wide transition-all duration-300 hover:bg-red-700"
              >
                <FaSignOutAlt />
                Logout
              </button>
            ) : (
              <>
                <button
                  onClick={() => navigate("/signin")}
                  className="flex items-center gap-2 px-5 py-2.5 rounded border border-white text-white font-medium text-[0.95rem] tracking-wide transition-all duration-300 hover:bg-teal-600 hover:text-white"
                >
                  <FaSignInAlt />
                  Sign In
                </button>
                <button
                  onClick={() => navigate("/signup")}
                  className="flex items-center gap-2 px-5 py-2.5 rounded bg-white text-black border border-white font-medium text-[0.95rem] tracking-wide transition-all duration-300 hover:bg-teal-700 hover:text-white"
                >
                  <FaUserPlus />
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>


        {/* Sidebar */}
        <div
          className={`fixed top-0 right-0 w-[300px] h-full backdrop-blur-md bg-[rgba(255,255,255,0.1)] shadow-lg border-l border-white/20 z-[1000] transition-all duration-300 ease-in-out overflow-y-auto p-6 flex flex-col ${
            sidebarOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex justify-between items-center mb-8 text-center">
            <Link
              to="/"
              className="flex items-center cursor-pointer"
              onClick={closeSidebar}
            >
              <div className="w-10 h-10">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-full h-full"
                >
                  <path
                    d="M12 2L3 7V17L12 22L21 17V7L12 2Z"
                    fill="#ffffff"
                    stroke="#2d5753"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M12 6L7 9V15L12 18L17 15V9L12 6Z"
                    fill="white"
                    stroke="#4f9a94"
                    strokeWidth="1"
                  />
                </svg>
              </div>
              <h1 className="text-xl font-bold text-white-600 tracking-wide font-playfair ml-2">
                Elpise Inn Hostel
              </h1>
            </Link>
            <button className="text-4xl text-teal-600" onClick={closeSidebar}>
              ×
            </button>
          </div>

          <div className="flex flex-col gap-6 mb-8 text-center">
            {routes.map(({ path, label, icon }) => (
              <NavLink
                key={path}
                path={path}
                label={label}
                icon={icon}
                isActive={isActive(path)}
                onClick={closeSidebar}
              />
            ))}
          </div>

          <div className="flex flex-col gap-4">
            {isLoggedIn ? (
              <button
                onClick={() => {
                  handleLogout();
                  closeSidebar();
                }}
                className="flex items-center gap-2 px-5 py-2.5 rounded bg-red-600 text-white font-medium text-[0.95rem] tracking-wide transition-all duration-300 hover:bg-red-700"
              >
                <FaSignOutAlt />
                Logout
              </button>
            ) : (
              <>
                <button
                  onClick={() => {
                    navigate("/signin");
                    closeSidebar();
                  }}
                  className="flex items-center gap-2 px-5 py-2.5 rounded border border-white text-white font-medium text-[0.95rem] tracking-wide transition-all duration-300 hover:bg-teal-50"
                >
                  <FaSignInAlt />
                  Sign In
                </button>
                <button
                  onClick={() => {
                    navigate("/signup");
                    closeSidebar();
                  }}
                  className="flex items-center gap-2 px-5 py-2.5 rounded bg-white border border-white text-black font-medium text-[0.95rem] tracking-wide transition-all duration-300 hover:bg-blue-700 hover:text-white"
                >
                  <FaUserPlus />
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
