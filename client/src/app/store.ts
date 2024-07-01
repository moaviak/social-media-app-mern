import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./api/apiSlice";
import { setupListeners } from "@reduxjs/toolkit/query";
import authReducer from "@/app/authSlice";

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: import.meta.env.VITE_REACT_APP_NODE_ENV === "development",
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
