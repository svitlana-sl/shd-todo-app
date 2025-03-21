import { configureStore } from "@reduxjs/toolkit";
import { todosApi } from "./apiSlice";

export const store = configureStore({
  reducer: {
    // Add reducer with its reducerPath key.
    [todosApi.reducerPath]: todosApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    // Add middleware for automatic cache handling, invalidation, polling,
    getDefaultMiddleware().concat(todosApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
