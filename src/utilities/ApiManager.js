'use client';
import { FetchWithAuth } from "./FetchWithAuth";


const LoginApi = async(formData) => {
    const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
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

const EventApi = async(formData) => {
    const url='/api/admin/data/eventoutreach';
    const res = await fetch(url);
    return res;
}

export {LoginApi, RegisterApi, EventApi}