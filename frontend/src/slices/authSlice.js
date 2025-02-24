import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    userInfo: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setCredentials: (state, action) => {
            state.userInfo = action.payload;
            localStorage.setItem("user", JSON.stringify(action.payload));
        },
        loggingOut: (state) => {
            state.userInfo = null;
            localStorage.removeItem("user");

        },

    }
});
export default authSlice.reducer;
export const { setCredentials, loggingOut } = authSlice.actions;
