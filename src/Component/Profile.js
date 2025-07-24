'use Client'
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

export default function Profile(){
    const [authData, setAuthData] = useState(null);
    useEffect(() => {
        const data = JSON.parse(sessionStorage.getItem("dsciAuthData"));
        setAuthData(data);
    },[])
    return(
        <div>
            <h1>Profile</h1>
            <p>{authData?.userName}</p>
            <p>{authData?.role}</p>
            <p>{authData?.email}</p>
        </div>
    )
}