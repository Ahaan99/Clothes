import { createSlice } from "@reduxjs/toolkit";

const loadState = () => {
  try {
    const serializedState = localStorage.getItem("authState");
    return serializedState ? JSON.parse(serializedState) : null;
  } catch (err) {
    return null;
  }
};

const adminCredentials = {
  email: "admin@printo.com",
  password: "admin123",
};

const initialState = loadState() || {
  user: null,
  token: null,
  error: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = `Bearer ${token}`;
      state.isAuthenticated = true;
      state.error = null;

      // Save to localStorage
      localStorage.setItem(
        "authState",
        JSON.stringify({
          user,
          token: `Bearer ${token}`,
          isAuthenticated: true,
          error: null,
        })
      );
    },
    logout: (state) => {
      localStorage.removeItem("authState");
      state.user = null;
      state.token = null;
      state.error = null;
      state.isAuthenticated = false;
    },
    setCredentials: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.error = null;
      state.isAuthenticated = true;
    },
  },
});

// Selectors
export const selectAuth = (state) => state.auth;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectUser = (state) => state.auth.user;
export const { login, logout, setCredentials } = authSlice.actions;
export default authSlice.reducer;
