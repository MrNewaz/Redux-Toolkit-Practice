import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const getTodosAsync = createAsyncThunk(
  'todos/getTodosAsync',
  async () => {
    const response = await fetch('http://localhost:7000/todos');
    if (response.ok) {
      const todos = await response.json();
      return { todos };
    }
  }
);

export const addTodoAsync = createAsyncThunk(
  'todos/addTodoAsync',
  async (payload) => {
    const response = await fetch('http://localhost:7000/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: payload.title }),
    });
    if (response.ok) {
      const todo = await response.json();
      return { todo };
    }
  }
);

export const toggleCompleteAsync = createAsyncThunk(
  'todos/addTodoAsync',
  async (payload) => {
    const response = await fetch(`http://localhost:7000/todos/${payload.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: payload.completed }),
    });

    if (response.ok) {
      const todo = await response.json();
      return { id: todo.id, completed: todo.completed };
    }
  }
);

const todoSlice = createSlice({
  name: 'todos',
  initialState: [],
  reducers: {
    addTodo: (state, action) => {
      const newTodo = {
        id: Date.now(),
        title: action.payload.title,
        completed: false,
      };
      state.push(newTodo);
    },
    toggleComplete: (state, action) => {
      const index = state.findIndex((todo) => todo.id === action.payload.id);
      state[index].completed = action.payload.completed;
    },
    deleteTodo: (state, action) => {
      return state.filter((todo) => todo.id !== action.payload.id);
    },
  },
  extraReducers: {
    [getTodosAsync.pending]: (state, action) => {
      console.log('data fetching....');
    },
    [getTodosAsync.fulfilled]: (state, action) => {
      console.log('data fetched');
      return action.payload.todos;
    },
    [addTodoAsync.fulfilled]: (state, action) => {
      state.push(action.payload.todo);
    },
    [toggleCompleteAsync.fulfilled]: (state, action) => {
      const index = state.findIndex((todo) => todo.id === action.payload.id);
      state[index].completed = action.payload.completed;
    },
  },
});

export const { addTodo, toggleComplete, deleteTodo } = todoSlice.actions;

export default todoSlice.reducer;
