import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../redux/store";
import { fetchTodos } from "../redux/todosSlice";

const TodoList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { todos, loading, error } = useSelector(
    (state: RootState) => state.todos,
  );

  useEffect(() => {
    dispatch(fetchTodos());
  }, [dispatch]);

  if (loading)
    return <p className="text-center text-gray-500">Loading todos...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <div className="mt-4">
      {todos.map((todo) => (
        <div key={todo.id} className="border-b p-2">
          <span>{todo.text}</span>
          <span className="ml-2 text-sm text-gray-500">{todo.category}</span>
        </div>
      ))}
    </div>
  );
};

export default TodoList;
