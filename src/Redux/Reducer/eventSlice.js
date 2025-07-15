import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  events: [],
  selectedEvent: null,
  isLoading: false,
  error: null,
  isSidebarOpen: false
};

const eventSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    setEvents(state, action) {
      state.events = action.payload;
    },
    selectEvent(state, action) {
      state.selectedEvent = action.payload;
      state.isSidebarOpen = true;
    },
    deselectEvent(state) {
      state.selectedEvent = null;
      state.isSidebarOpen = false;
    },
    setLoading(state, action) {
      state.isLoading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    }
  }
});

export const { setEvents, selectEvent, deselectEvent, setLoading, setError } = eventSlice.actions;
export default eventSlice.reducer;
