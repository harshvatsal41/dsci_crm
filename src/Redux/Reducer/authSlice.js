import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

const initialState = {
    role: typeof window !== "undefined" ? localStorage.getItem("dsciAuthRole") || "" : "",
    token: typeof window !== "undefined" ? localStorage.getItem("dsciAuthToken") || "" : "",
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login: (state, action) => {

            const { token, role } = action.payload;
            state.token = token;
            state.role = role; // Store role in the Redux store
            localStorage.setItem("dsciAuthToken", token);
            localStorage.setItem("dsciAuthRole", role); // Store role in localStorage
            Cookies.set("dsciAuthToken", token, { path: "/" });
            Cookies.set("dsciAuthRole", role, { path: "/" }); // Store role in cookies
        },
        logout: (state) => {
            state.token = "";
            state.role = "";
            localStorage.removeItem("dsciAuthToken");
            localStorage.removeItem("dsciAuthRole");
            Cookies.remove("dsciAuthToken");
            Cookies.remove("dsciAuthRole");
        },
        loadToken: (state) => {
            const token = localStorage.getItem("dsciAuthToken") || Cookies.get("dsciAuthToken") || "";
            const role = localStorage.getItem("dsciAuthRole") || Cookies.get("dsciAuthRole") || "";
            state.token = token;
            state.role = role;
        },
    },
});

export const { login, logout, loadToken } = authSlice.actions;
export default authSlice.reducer;