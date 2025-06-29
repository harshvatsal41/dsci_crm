import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/Redux/Reducer/authSlice";
import menuReducer from "@/Redux/Reducer/menuSlice";
import eventReducer from "@/Redux/Reducer/eventSlice";
import { persistStore } from "redux-persist";


export const store = configureStore({
    reducer: {
        auth: authReducer,
        menu: menuReducer,
        events: eventReducer,
    },
    middleware: (getDefaultMiddleware) =>{
        return getDefaultMiddleware({
            serializableCheck: false, // Disable serializable check for cookies
        });
    }
        

});

export const persistor = persistStore(store);