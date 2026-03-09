import { createSlice } from "@reduxjs/toolkit";

const getStoredUser = () => {
    if (typeof window !== "undefined") {
        const user = localStorage.getItem("login_user");
        return user ? JSON.parse(user) : null;
    }
    return null;
};

const initialState = {
    isAuthenticated: !!getStoredUser(),
    user: getStoredUser(),
};

const loginSlice = createSlice({
    name: "login",
    initialState,
    reducers: {
        login: (state, action) => {
            state.isAuthenticated = true;
            state.user = action.payload;
            localStorage.setItem("login_user", JSON.stringify(action.payload));
        },
        logout: (state) => {
            state.isAuthenticated = false;
            state.user = null;
            localStorage.removeItem("login_user");
        },
        setUserData: (state, action) => {
            state.isAuthenticated = true;
            state.user = action.payload;
        },
    },
});

export const { login, logout, setUserData } = loginSlice.actions;
export default loginSlice.reducer;
