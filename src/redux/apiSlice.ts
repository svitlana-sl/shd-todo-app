import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define the Todo interface (same as before)
export interface Todo {
  id: number;
  text: string;
  category: string;
  completed: boolean;
  description?: string;
}

// Create an API slice with endpoints for todos
export const todosApi = createApi({
  reducerPath: "todosApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://locrian-sand-eyebrow.glitch.me",
  }),
  tagTypes: ["Todos"],
  endpoints: (builder) => ({
    // Fetch all todos
    getTodos: builder.query<Todo[], void>({
      query: () => "/todos",
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Todos" as const, id })),
              { type: "Todos", id: "LIST" },
            ]
          : [{ type: "Todos", id: "LIST" }],
    }),
    // Create a new todo
    createTodo: builder.mutation<Todo, Partial<Todo>>({
      query: (newTodo) => ({
        url: "/todos",
        method: "POST",
        body: newTodo,
      }),
      invalidatesTags: [{ type: "Todos", id: "LIST" }],
    }),
    // Update an existing todo
    updateTodo: builder.mutation<Todo, Partial<Todo>>({
      query: (updatedTodo) => ({
        url: `/todos/${updatedTodo.id}`,
        method: "PUT",
        body: updatedTodo,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Todos", id }],
    }),
    // Remove a todo
    removeTodo: builder.mutation<{ success: boolean; id: number }, number>({
      query: (id) => ({
        url: `/todos/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [{ type: "Todos", id }],
    }),
  }),
});

// Export auto-generated hooks for each endpoint
export const {
  useGetTodosQuery,
  useCreateTodoMutation,
  useUpdateTodoMutation,
  useRemoveTodoMutation,
} = todosApi;
