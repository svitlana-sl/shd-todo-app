import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

export interface Todo {
  id: number;
  text: string;
  category: string;
  completed: boolean;
  description?: string;
}

interface TodosState {
  todos: Todo[];
  loading: boolean;
  error: string | null;
}

const initialState: TodosState = {
  todos: [],
  loading: false,
  error: null,
};

// ✅ Fetch Todos from API
export const fetchTodos = createAsyncThunk<Todo[]>(
  "todos/fetchTodos",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch("http://localhost:5000/todos");
      if (!response.ok) throw new Error("Failed to fetch todos");
      return await response.json();
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  },
);

// ✅ Update Todo (API)
export const updateTodo = createAsyncThunk(
  "todos/updateTodo",
  async (updatedTodo: Todo, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `http://localhost:5000/todos/${updatedTodo.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedTodo),
        },
      );

      if (!response.ok) throw new Error("Failed to update todo");
      return await response.json();
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  },
);

const todosSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {
    addTodo: (state, action: PayloadAction<Todo>) => {
      state.todos.push(action.payload);
    },
    removeTodo: (state, action: PayloadAction<number>) => {
      state.todos = state.todos.filter((todo) => todo.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTodos.fulfilled, (state, action: PayloadAction<Todo[]>) => {
        state.loading = false;
        state.todos = action.payload;
      })
      .addCase(fetchTodos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateTodo.fulfilled, (state, action: PayloadAction<Todo>) => {
        const index = state.todos.findIndex(
          (todo) => todo.id === action.payload.id,
        );
        if (index !== -1) state.todos[index] = action.payload;
      });
  },
});

export const { addTodo, removeTodo } = todosSlice.actions;
export default todosSlice.reducer;
