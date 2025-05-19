'use client';
import React, { useState } from "react";
import Link from "next/link";
import { FaUserCircle, FaSun, FaMoon, FaGamepad, FaHome, FaUsers } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "@/Store/themeSlice";
import type { RootState } from "@/Store";

const mockUser = {
  name: "John Doe",
  email: "john@example.com",
};

const Navbar: React.FC = () => {
  const [profileOpen, setProfileOpen] = useState(false);
  const dispatch = useDispatch();
  const dark = useSelector((state: RootState) => state.theme.dark);

  const handleThemeToggle = () => {
    dispatch(toggleTheme());
    if (typeof window !== "undefined") {
      document.documentElement.classList.toggle("dark");
    }
  };

  return (
    <nav
      className={
        dark
          ? "w-full max-h-16 bg-gray-900/90 shadow-md fixed top-0 left-0 z-50 transition-colors duration-300"
          : "w-full max-h-16 bg-gradient-to-r from-blue-200 via-blue-300 to-purple-200 shadow-md fixed top-0 left-0 z-50 transition-colors duration-300"
      }
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center gap-2 cursor-pointer">
              <FaGamepad className={dark ? "text-2xl text-purple-400" : "text-2xl text-blue-700"} />
              <span className={`font-bold text-lg tracking-tight hidden sm:inline ${dark ? "text-purple-200" : "text-blue-900"}`}>RandomApp</span>
            </Link>
          </div>
          {/* Center: Nav Links */}
          <div className="flex-1 flex justify-center items-center">
            <div className="flex gap-4 sm:gap-8">
              <Link
                href="/"
                className={`flex items-center gap-1 font-medium transition cursor-pointer ${
                  dark
                    ? "text-gray-200 hover:text-purple-400"
                    : "text-blue-900 hover:text-purple-700"
                }`}
              >
                <FaHome className="inline sm:mr-1" /> <span className="hidden sm:inline">Home</span>
              </Link>
              <Link
                href="/social"
                className={`flex items-center gap-1 font-medium transition cursor-pointer ${
                  dark
                    ? "text-gray-200 hover:text-purple-400"
                    : "text-blue-900 hover:text-purple-700"
                }`}
              >
                <FaUsers className="inline sm:mr-1" /> <span className="hidden sm:inline">Social</span>
              </Link>
              <Link
                href="/games"
                className={`flex items-center gap-1 font-medium transition cursor-pointer ${
                  dark
                    ? "text-gray-200 hover:text-purple-400"
                    : "text-blue-900 hover:text-purple-700"
                }`}
              >
                <FaGamepad className="inline sm:mr-1 " /> <span className="hidden sm:inline">Games</span>
              </Link>
            </div>
          </div>
          {/* Right: Profile & Theme */}
          <div className="flex items-center gap-3 relative">
            <button
              onClick={handleThemeToggle}
              className={`p-2 rounded-full transition ${
                dark
                  ? "hover:bg-gray-800"
                  : "hover:bg-blue-100"
              }`}
              aria-label="Toggle theme"
            >
              {dark ? <FaSun className="text-xl text-yellow-400 cursor-pointer" /> : <FaMoon className="text-xl text-blue-500 cursor-pointer" />}
            </button>
            <button
              onClick={() => setProfileOpen((v) => !v)}
              className={`p-1 rounded-full transition ${
                dark
                  ? "hover:bg-gray-800"
                  : "hover:bg-blue-100"
              }`}
              aria-label="Profile"
            >
              <FaUserCircle className={dark ? "text-2xl text-purple-200" : "text-2xl text-blue-700" + " hover:text-purple-700 cursor-pointer"} />
            </button>
            {/* Profile Dropdown */}
            {profileOpen && (
              <div className={`absolute right-0 top-12 w-56 rounded-xl shadow-lg border py-3 z-50 animate-fade-in ${
                dark
                  ? "bg-gray-900 border-gray-800"
                  : "bg-white border-blue-200"
              }`}>
                <div className={`px-4 py-2 border-b ${dark ? "border-gray-800" : "border-blue-100"}`}>
                  <div className={dark ? "font-semibold text-purple-200" : "font-semibold text-blue-900"}>{mockUser.name}</div>
                  <div className={dark ? "text-xs text-gray-400" : "text-xs text-blue-700"}>{mockUser.email}</div>
                </div>
                <button
                  onClick={handleThemeToggle}
                  className={`w-full flex items-center gap-2 px-4 py-2 transition ${
                    dark
                      ? "text-gray-200 hover:bg-gray-800"
                      : "text-blue-900 hover:bg-blue-50"
                  }`}
                >
                  {dark ? <FaSun /> : <FaMoon />}
                  <span>Toggle Theme</span>
                </button>
                <button
                  onClick={() => alert("Logged out!")}
                  className={`w-full flex items-center gap-2 px-4 py-2 transition ${
                    dark
                      ? "text-red-400 hover:bg-gray-800"
                      : "text-red-600 hover:bg-red-50"
                  }`}
                >
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;