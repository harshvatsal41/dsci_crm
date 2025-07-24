"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import Logout from "./Logout";
import dynamic from 'next/dynamic';

// Dynamically import icons to avoid hydration mismatch
const FiUser = dynamic(() => import('react-icons/fi').then(mod => mod.FiUser), { ssr: false });
const FiLogOut = dynamic(() => import('react-icons/fi').then(mod => mod.FiLogOut), { ssr: false });
const FiChevronDown = dynamic(() => import('react-icons/fi').then(mod => mod.FiChevronDown), { ssr: false });
const FiChevronUp = dynamic(() => import('react-icons/fi').then(mod => mod.FiChevronUp), { ssr: false });
const FiHome = dynamic(() => import('react-icons/fi').then(mod => mod.FiHome), { ssr: false });
const FiGrid = dynamic(() => import('react-icons/fi').then(mod => mod.FiGrid), { ssr: false });
const FiUsers = dynamic(() => import('react-icons/fi').then(mod => mod.FiUsers), { ssr: false });

const Navbar = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [isMounted, setIsMounted] = useState(false);
  const token = useSelector((state) => state.auth.token);
  const role = useSelector((state) => state.auth.role)?.toUpperCase();

  useEffect(() => {
    setIsMounted(true);
    
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Return simplified version for SSR
  if (!isMounted) {
    return (
      <nav className="flex justify-between items-center p-4 bg-white border-b border-gray-200 shadow-sm font-sans">
        <Link href="/">
          <h1 className="text-xl font-bold text-indigo-600 cursor-pointer">DSCI CMS</h1>
        </Link>
        <div className="flex items-center space-x-6">
          <div className="w-6 h-6 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="flex justify-between items-center p-4 bg-white border-b border-gray-200 shadow-sm font-sans">
      <Link href="/" className="hover:scale-105 transition-transform">
        <h1 className="text-xl font-bold text-indigo-600 cursor-pointer">DSCI CMS</h1>
      </Link>

      <div className="flex items-center space-x-6">
        {token ? (
          <>
            <NavLink href="/administration/dashboard">
              <FiGrid className="inline mr-1" /> Dashboard
            </NavLink>
            
            {role === "ADMIN" && (
              <NavLink href="/administration/usermanagement">
                <FiUsers className="inline mr-1" /> User Management
              </NavLink>
            )}
            
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-1 text-gray-600 hover:text-indigo-600 transition-colors"
              >
                <FiUser className="inline mr-1" />
                <span>Profile</span>
                {isProfileOpen ? (
                  <FiChevronUp className="ml-1" />
                ) : (
                  <FiChevronDown className="ml-1" />
                )}
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg overflow-hidden transition-all duration-300 ease-in-out">
                  <ProfileDropdown />
                </div>
              )}
            </div>
            
            <Logout />
          </>
        ) : (
          <>
            <NavLink href="/">
              <FiHome className="inline mr-1" /> Home
            </NavLink>
            <NavLink href="/administration/login">Admin Login</NavLink>
            <NavLink href="/administration/register">Register</NavLink>
          </>
        )}
      </div>
    </nav>
  );
};

const ProfileDropdown = () => {
  const [authData, setAuthData] = useState(null);

  useEffect(() => {
    // Only access sessionStorage on client side
    if (typeof window !== 'undefined') {
      const data = JSON.parse(sessionStorage.getItem("dsciAuthData"));
      setAuthData(data);
    }
  }, []);

  return (
    <>
      <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-purple-50">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
            <FiUser size={20} />
          </div>
          <div>
            <p className="font-medium text-gray-900">{authData?.userName || "User"}</p>
            <p className="text-sm text-gray-500">{authData?.email || "user@example.com"}</p>
            <span className="inline-block mt-1 text-xs px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full">
              {authData?.role || "User"}
            </span>
          </div>
        </div>
      </div>

      <div className="py-1">
        <Link
          href="/administration/profile"
          className="block px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <FiUser className="inline mr-3 text-gray-500" />
          View Full Profile
        </Link>
        <div className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors">
          <FiLogOut className="inline mr-3 text-gray-500" />
          <Logout />
        </div>
      </div>
    </>
  );
};

const NavLink = ({ href, children, onClick }) => {
  if (onClick) {
    return (
      <button
        onClick={onClick}
        className="relative group text-gray-600 hover:text-indigo-600 transition-colors"
      >
        {children}
        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-600 transition-all group-hover:w-full"></span>
      </button>
    );
  }
  return (
    <Link
      href={href}
      className="relative group text-gray-600 hover:text-indigo-600 transition-colors"
    >
      {children}
      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-600 transition-all group-hover:w-full"></span>
    </Link>
  );
};

export default Navbar;