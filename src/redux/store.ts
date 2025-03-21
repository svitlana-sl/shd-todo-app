import { configureStore } from "@reduxjs/toolkit";
import { todosApi } from "./apiSlice";

export const store = configureStore({
  reducer: {
    // Add the RTK Query reducer with its reducerPath key.
    [todosApi.reducerPath]: todosApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    // Add the RTK Query middleware for automatic cache handling, invalidation, etc.
    getDefaultMiddleware().concat(todosApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
