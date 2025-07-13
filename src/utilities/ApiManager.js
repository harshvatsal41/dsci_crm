'use client';
import { FetchWithAuth } from "./FetchWithAuth";


const LoginApi = async(formData) => {
    const res = await FetchWithAuth("/api/admin/auth/login", "POST", formData);
    return res;
}

const RegisterApi = async(formData) => {
    const url='/api/admin/auth/register';
    const res = await FetchWithAuth(url, "POST", formData);
    return res;
}

const EventApi = async(data=null, method="GET", params={}) => {
    if(params.Id && method === "GET"){
        const url='/api/admin/data/eventoutreach/'+params.Id;
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
    else if(method==="PUT"){
        const url='/api/admin/data/eventoutreach/'+params.Id;
        const res = await FetchWithAuth(url, "PUT", data);
        return res;
    }
}

// Event Post api is still in page

const BroadFocusAreaApi = async(data, method, params={}) => {
    if(params.Id && method === "GET"){
        const url='/api/admin/data/focusarea?eventId='+params.Id;
        const res = await FetchWithAuth(url);
        return res;
    }
    else if(method==="GET"){
        const url='/api/admin/data/focusarea?eventId='+params.id;
        const res = await FetchWithAuth(url);
        return res;
    }
    else if(method==="POST" && params.Id){
        const url='/api/admin/data/focusarea/'+params.Id;
        const res = await FetchWithAuth(url, "POST", data);
        return res;
    }
    else if(method==="POST"){
        const url='/api/admin/data/focusarea';
        const res = await FetchWithAuth(url, "POST", data);
        return res;
    }else if(method==="DELETE"){
        const url='/api/admin/data/focusarea/'+params.Id;
        const res = await FetchWithAuth(url, "DELETE", data);
        return res;
    }
    
}



export {LoginApi, RegisterApi, EventApi, BroadFocusAreaApi}