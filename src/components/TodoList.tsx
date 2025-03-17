import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../redux/store";
import { fetchTodos } from "../redux/todosSlice";
import { Badge } from "@/components/ui/badge";

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
          <Badge variant="outline">{todo.category}</Badge>
        </div>
      ))}
    </div>
  );
};

export default TodoList;
