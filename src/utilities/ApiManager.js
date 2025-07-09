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

const EventApi = async(data=null, method="GET", params={}) => {

    if(params.id && method === "GET"){
        const url='/api/admin/data/eventoutreach/'+params.id;
        const res = await FetchWithAuth(url);
        return res;
    }
    else if(method==="GET"){
        const url='/api/admin/data/eventoutreach';
        const res = await FetchWithAuth(url);
        return res;
    }
    else if(method==="POST"){
        const url='/api/admin/data/eventoutreach';
        const res = await FetchWithAuth(url, "POST", data);
        return res;
    }
}

const BroadFocusAreaApi = async(data, method, params={}) => {
    if(params.id && method === "Get"){
        const url='/api/admin/data/focusarea?eventId='+params.id;
        const res = await fetch(url);
        return res;
    }
    else if(method==="Get"){
        const url='/api/admin/data/focusarea?eventId='+params.id;
        const res = await fetch(url);
        return res;
    }
    else if(method==="Post"){
        const url='/api/admin/data/focusarea';
        const res = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "form-data" },
            body: data
          });
        return res;
    }
    
}



export {LoginApi, RegisterApi, EventApi, BroadFocusAreaApi}