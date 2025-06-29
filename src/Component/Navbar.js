"use client";

import { useSelector } from "react-redux";
import Logout from "./Logout";
import Link from "next/link";
import { useEffect, useState } from "react";

const Navbar = () => {
    const token = useSelector((state) => state.auth.token);
    const role = useSelector((state) => state.auth.role);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) return null;

    return (
        <nav className="flex  justify-between items-center p-4 bg-white border-b border-gray-200">
            {/* Logo */}
            <div>
                <Link href="/">
                    <h1 className="text-xl font-medium text-gray-800 cursor-pointer">DSCi CMS</h1>
                </Link>
            </div>

            {/* Navigation Links */}
            <div className="flex items-center space-x-6">
                {token ? (
                    <>
                        {role === "ADMIN" && (
                            <div className="flex space-x-6">
                                <Link 
                                    href="/dashboard" 
                                    className="text-gray-600 hover:text-gray-900 transition-colors"
                                >
                                    Dashboard
                                </Link>
                                <Link 
                                    href="/profile" 
                                    className="text-gray-600 hover:text-gray-900 transition-colors"
                                >
                                    Profile
                                </Link>
                            </div>
                        )}
                        <div className="text-gray-600 transition-colors">
                            <Logout />
                        </div>
                    </>
                ) : (
                    <>
                        <Link 
                            href="/" 
                            className="text-gray-600 hover:text-gray-900 transition-colors"
                        >
                            Home
                        </Link>
                        <Link 
                            href="/administration/login" 
                            className="text-gray-600 hover:text-gray-900 transition-colors"
                        >
                            Admin Login
                        </Link>
                        <Link 
                            href="/administration/register" 
                            className="text-gray-600 hover:text-gray-900 transition-colors"
                        >
                            Register
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;