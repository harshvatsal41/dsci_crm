"use client"; // Required for client-side state management

import { Provider } from "react-redux";
import React from "react";
import {store} from "@/Redux/Store/store";


const Providers = ({ children }) => {
    return <Provider store={store}>{children}</Provider>;
};

export default Providers;