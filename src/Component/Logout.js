"use client";

import {useDispatch, useSelector} from "react-redux";
import { useRouter } from "next/navigation";
import {logout} from "@/Redux/Reducer/authSlice";
import { setLoading} from "@/Redux/Reducer/menuSlice";
import { persistor } from "@/Redux/Store/store";

const Logout = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const role = useSelector((state) => state.auth.role);

  const handleLogout = () => {
    dispatch(setLoading(true));

    document.cookie = "dsciAuthToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    document.cookie = "dsciAuthToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";

    dispatch(logout());
    persistor.purge(); 

    let redirectPath = "/administration/login";

    // let redirectPath = "/";
    // if (role === "vendor") {
      
    // } else if (role === "ADMIN") {
    //   redirectPath = "/administration/login";
    // }

    // Fallback: turn off loader after 2 seconds if event doesn't fire
    const fallback = setTimeout(() => {
      dispatch(setLoading(false));
    }, 1000);

    const handleRouteChangeComplete = () => {
      clearTimeout(fallback);
      router.events?.off("routeChangeComplete", handleRouteChangeComplete);
      dispatch(setLoading(false));
    };

    router.events?.on("routeChangeComplete", handleRouteChangeComplete);
    router.push(redirectPath);
  };

  return (
    <div>
      <button onClick={handleLogout} className="  text-black rounded">
        Logout
      </button>
    </div>
  );
};

export default Logout;