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
        const url=`/api/admin/data/focusarea/delete?focusAreaId=${params.Id}`;
        const res = await FetchWithAuth(url, "POST");
        return res;
    }
    
}


// Speaker Api
const SpeakerApi=async(data, method, params={}) => {
    if(params.Id && method === "GET"){
        const url='/api/admin/data/speaker?eventId='+params.Id;
        const res = await FetchWithAuth(url);
        return res;
    }
    else if(method==="GET"){
        const url='/api/admin/data/speaker?eventId='+params.id;
        const res = await FetchWithAuth(url);
        return res;
    }
    else if(method==="POST" && params.Id){
        const url=`/api/admin/data/speaker/update?speakerId=${params.Id}`;
        const res = await FetchWithAuth(url, "POST", data);
        return res;
    }
    else if(method==="POST"){
        const url='/api/admin/data/speaker';
        const res = await FetchWithAuth(url, "POST", data);
        return res;
    }else if(method==="DELETE"){
        const url=`/api/admin/data/speaker/delete?speakerId=${params.Id}`;
        const res = await FetchWithAuth(url, "POST");
        return res;
    }   
}


// Faq Api
const FaqApi=async(data, method, params={}) => {
    if(params.Id && method === "GET"){
        const url='/api/admin/data/faq?eventId='+params.Id;
        const res = await FetchWithAuth(url);
        return res;
    }
    else if(method==="GET"){
        const url='/api/admin/data/faq?eventId='+params.id;
        const res = await FetchWithAuth(url);
        return res;
    }
    else if(method==="POST" && params.Id){
        const url=`/api/admin/data/faq?eventId=${params.Id}`;
        const res = await FetchWithAuth(url, "POST", data);
        return res;
    }
    else if(method==="PUT" && params.Id){
        const url=`/api/admin/data/faq/update?faqId=${params.Id}`;
        const res = await FetchWithAuth(url, "POST", data);
        return res;
    }else if(method==="DELETE"){
        const url=`/api/admin/data/faq/delete?faqId=${params.Id}`;
        const res = await FetchWithAuth(url, "POST");
        return res;
    }   
}


// Testimonial Api
const TestimonialApi=async(data, method, params={}) => {
    if(params.Id && method === "GET"){
        const url='/api/admin/data/testimonial?eventId='+params.Id;
        const res = await FetchWithAuth(url);
        return res;
    }
    else if(method==="GET"){
        const url='/api/admin/data/testimonial?eventId='+params.id;
        const res = await FetchWithAuth(url);
        return res;
    }
    else if(method==="POST" && params.Id){
        const url=`/api/admin/data/testimonial?eventId=${params.Id}`;
        const res = await FetchWithAuth(url, "POST", data);
        return res;
    }
    else if(method==="PUT" && params.Id){
        const url=`/api/admin/data/testimonial/update?testimonialId=${params.Id}`;
        const res = await FetchWithAuth(url, "POST", data);
        return res;
    }else if(method==="DELETE"){
        const url=`/api/admin/data/testimonial/delete?testimonialId=${params.Id}`;
        const res = await FetchWithAuth(url, "POST");
        return res;
    }   
}

// Blog Api
const BlogApi=async(data, method, params={}) => {
    if(params.Id && method === "GET"){
        const url='/api/admin/data/blog?eventId='+params.Id;
        const res = await FetchWithAuth(url);
        return res;
    }
    else if(method==="GET"){
        const url='/api/admin/data/blog?eventId='+params.id;
        const res = await FetchWithAuth(url);
        return res;
    }
    else if(method==="POST" && params.Id){
        const url=`/api/admin/data/blog?eventId=${params.Id}`;
        const res = await FetchWithAuth(url, "POST", data);
        return res;
    }
    else if(method==="PUT" && params.Id){
        const url=`/api/admin/data/blog/update?blogId=${params.Id}`;
        const res = await FetchWithAuth(url, "POST", data);
        return res;
    }else if(method==="DEL"){
        const url=`/api/admin/data/blog/delete?blogId=${params.Id}`;
        const res = await FetchWithAuth(url, "POST");
        return res;
    }   
}

// Ticket Api
const TicketApi = async (data = null, method = "GET", params = {}) => {
    if (method === "GET") {
        if (params.Id) {
            const url = '/api/admin/data/ticket?eventId=' + params.Id;
            const res = await FetchWithAuth(url);
            return res;
        } else {
            const url = '/api/admin/data/ticket?eventId=' + params.id;
            const res = await FetchWithAuth(url);
            return res;
        }
    } else if (method === "POST" && params.Id) {
        console.log("data", data);
        const url = `/api/admin/data/ticket?eventId=${params.Id}`;
        const res = await FetchWithAuth(url, "POST", data);
        return res;
    } else if (method === "PUT" && params.Id) {
        const url = `/api/admin/data/ticket/update?ticketId=${params.Id}`;
        const res = await FetchWithAuth(url, "POST", data);
        return res;
    } else if (method === "DEL") {
        const url = `/api/admin/data/ticket/delete?ticketId=${params.Id}`;
        const res = await FetchWithAuth(url, "POST");
        return res;
    }

}

//Agenda Api
const AgendaApi= async(data, method, params={}) => {
    if(params.Id && method === "GET"){
        const url='/api/admin/data/agenda?eventId='+params.Id;
        const res = await FetchWithAuth(url);
        return res;
    }
    else if(method==="GET"){
        const url='/api/admin/data/agenda?eventId='+params.id;
        const res = await FetchWithAuth(url);
        return res;
    }
    else if(method==="POST" && params.Id){
        const url=`/api/admin/data/agenda?eventId=${params.Id}`;
        const res = await FetchWithAuth(url, "POST", data);
        return res;
    }
    else if(method==="PUT" && params.Id){
        const url=`/api/admin/data/agenda/update?agendaId=${params.Id}`;
        const res = await FetchWithAuth(url, "POST", data);
        return res;
    }else if(method==="DEL"){
        const url=`/api/admin/data/agenda/delete?agendaId=${params.Id}`;
        const res = await FetchWithAuth(url, "POST");
        return res;
    }   
}

//Collaboration Api 
const CollaborationApi= async(data=null, method="GET", params={}) => {
    console.log("data", data, method, params);
    if(params.Id && method === "GET"){
        const url='/api/admin/data/collab?eventId='+params.Id;
        const res = await FetchWithAuth(url);
        return res;
    }
    else if(method==="GET"){
        const url='/api/admin/data/collab?eventId='+params.id;
        const res = await FetchWithAuth(url);
        return res;
    }
    else if(method==="POST" && params.Id){
        const url=`/api/admin/data/collab?eventId=${params.Id}`;
        const res = await FetchWithAuth(url, "POST", data);
        return res;
    }
    else if(method==="PUT" && params.Id){
        const url=`/api/admin/data/collab/update?collaborationId=${params.Id}`;
        const res = await FetchWithAuth(url, "POST", data);
        return res;
    }else if(method==="DEL"){
        const url=`/api/admin/data/collab/delete?collaborationId=${params.Id}`;
        const res = await FetchWithAuth(url, "POST");
        return res;
    }   
}

//SubCategory Api 
const ColabCategoryApi= async(data={}, method="GET", params={}) => {
    if(params.Id && method === "GET"){
        const url='/api/admin/data/colabcatagory?eventId='+params.Id;
        const res = await FetchWithAuth(url);
        return res;
    }
    else if(method==="GET"){
        const url='/api/admin/data/colabcatagory?eventId='+params.id;
        const res = await FetchWithAuth(url);
        return res;
    }
    else if(method==="POST" && params.Id){
        const url=`/api/admin/data/colabcatagory?eventId=${params.Id}`;
        const res = await FetchWithAuth(url, "POST", data);
        return res;
    }
    else if(method==="PUT" && params.Id){
        const url=`/api/admin/data/colabcatagory/update?subCatagoryId=${params.Id}`;
        console.log("url", url, data)
        const res = await FetchWithAuth(url, "POST", data);
        return res;
    }else if(method==="DEL"){
        const url=`/api/admin/data/colabcatagory/delete?subCatagoryId=${params.Id}`;
        console.log("params", url)
        const res = await FetchWithAuth(url, "POST", data);
        return res;
    }   
}


// User Management
const Roles= async(data=null, method="GET", params={}) => {
   let url='/api/admin/data/roles';
//    For update the roles
   if(params.Id && method === "POST"){
    url=`/api/admin/data/roles/update?roleId=${params.Id}`;
   }
   const res = await FetchWithAuth(url, method, data);
   return res;
}


//Get Employee
const Employee= async(data=null, method="GET", params={}) => {
    let url='/api/admin/data/employee';
    console.log("data", data, method, params)
    
    if(params.Id && method === "POST"){
        url=`/api/admin/data/employee?employeeId=${params.Id}`;
    }
    const res = await FetchWithAuth(url, method, data);
    return res;
}

export {LoginApi, RegisterApi, EventApi, BroadFocusAreaApi, SpeakerApi, FaqApi, TestimonialApi, BlogApi, TicketApi, AgendaApi, CollaborationApi, ColabCategoryApi, Roles, Employee}