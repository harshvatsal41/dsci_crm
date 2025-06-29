'use client';
import { FetchWithAuth } from "./FetchWithAuth";


const LoginApi = async(method, body) => {
    const url='/api/admin/auth/login';
    const response = await FetchWithAuth(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });
    return response;
}

const RegisterApi = async(method, body) => {
    const url='/api/admin/auth/register';
    const response = await FetchWithAuth(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });
    return response;
}

export {LoginApi, RegisterApi}