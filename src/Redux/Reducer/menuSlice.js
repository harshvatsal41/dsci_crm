// src/Redux/menuSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {

};

const menuSlice = createSlice({
  name: "menu",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },

});

export const {
  setLoading,
} = menuSlice.actions;

export default menuSlice.reducer;
