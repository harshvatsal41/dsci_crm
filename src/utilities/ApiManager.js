'use client';
import { FetchWithAuth } from "./FetchWithAuth";


const LoginApi = async(formData) => {
    const res = await FetchWithAuth("/api/admin/auth/login", "POST", formData);
    return res;
}

const RegisterApi = async(formData) => {
    const url='/api/admin/auth/register';
    const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
    return res;
}

const EventApi = async(data, method) => {
    if(method==="Get"){
        const url='/api/admin/data/eventoutreach';
        const res = await FetchWithAuth(url);
        return res;
    }
    if(method==="Post"){
        const url='/api/admin/data/eventoutreach';
        const res = await FetchWithAuth(url, "POST", data);
        return res;
    }
}

export {LoginApi, RegisterApi, EventApi}