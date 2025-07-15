"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { logout } from "@/Redux/Reducer/authSlice";

const LogoutPage = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const role = useSelector((state) => state.auth.role);

    useEffect(() => {
        // Remove cookie
        document.cookie =
            "dsciAuthToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";

        // Dispatch Redux logout
        dispatch(logout());

        // Redirect after short delay
        const timer = setTimeout(() => {
         //     router.push("/login")
            router.push("/")
        }, 1000); // 1 second for smooth transition

        return () => clearTimeout(timer);
    }, [dispatch, router, role]);

    return (
        <div className="flex items-center justify-center h-screen">
            <p className="text-lg animate-pulse">Logging out...</p>
        </div>
    );
};

export default LogoutPage;
