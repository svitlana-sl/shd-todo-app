import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../redux/store";
import { fetchTodos } from "../redux/todosSlice";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Card } from "@/components/ui/card";

interface Category {
  id: string;
  name: string;
  color: string;
}

const TodoList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { todos, loading, error } = useSelector(
    (state: RootState) => state.todos,
  );
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    dispatch(fetchTodos());

    fetch("http://localhost:5000/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error("Failed to fetch categories", err));
  }, [dispatch]);

  if (loading)
    return <p className="text-center text-gray-500">Loading todos...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;
  if (!todos.length)
    return <p className="text-center text-gray-500">No todos found.</p>;

  return (
    <div className="mt-4 space-y-2">
      {todos.map((todo) => {
        const category = categories.find((cat) => cat.id === todo.category);

        return (
          <Card key={todo.id} className="flex flex-col gap-2 p-4">
            <div className="flex items-center gap-3">
              <Checkbox checked={todo.completed} />
              <span
                className={`text-lg ${todo.completed ? "text-muted-foreground line-through" : ""}`}
              >
                {todo.text}
              </span>
              {category && (
                <Badge style={{ backgroundColor: category.color }}>
                  {category.name}
                </Badge>
              )}
            </div>

            <Collapsible>
              <CollapsibleTrigger className="text-muted-foreground cursor-pointer text-sm">
                Show description
              </CollapsibleTrigger>
              <CollapsibleContent>
                <p className="mt-2 text-gray-700">{todo.description}</p>
              </CollapsibleContent>
            </Collapsible>
          </Card>
        );
      })}
    </div>
  );
};

export default TodoList;
