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
    updateTodo: (
      state,
      action: PayloadAction<{
        id: number;
        text?: string;
        category?: string;
        completed?: boolean;
        description?: string;
      }>,
    ) => {
      const { id, text, category, completed, description } = action.payload;
      const todo = state.todos.find((todo) => todo.id === id);
      if (todo) {
        if (text !== undefined) todo.text = text;
        if (category !== undefined) todo.category = category;
        if (completed !== undefined) todo.completed = completed;
        if (description !== undefined) todo.description = description;
      }
    },
    clearTodos: (state) => {
      state.todos = [];
    },
    editTodo: (
      state,
      action: PayloadAction<{
        id: number;
        text?: string;
        description?: string;
      }>,
    ) => {
      const { id, text, description } = action.payload;
      const todo = state.todos.find((todo) => todo.id === id);
      if (todo) {
        if (text !== undefined) todo.text = text;
        if (description !== undefined) todo.description = description;
      }
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
      });
  },
});

export const { addTodo, removeTodo, updateTodo, clearTodos, editTodo } =
  todosSlice.actions;
export default todosSlice.reducer;
