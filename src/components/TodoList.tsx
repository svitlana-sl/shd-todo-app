import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../redux/store";
import { Todo, fetchTodos, removeTodo, updateTodo } from "../redux/todosSlice";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Card } from "@/components/ui/card";
import { Pencil, Trash } from "lucide-react";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectItem } from "@/components/ui/select";
import { toast, Toaster } from "sonner";

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
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);

  useEffect(() => {
    dispatch(fetchTodos());

    fetch("http://localhost:5000/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error("Failed to fetch categories", err));
  }, [dispatch]);

  const handleEditTodo = (todo: Todo) => {
    setEditingTodo(todo);
  };

  const handleSaveTodo = () => {
    if (editingTodo) {
      dispatch(
        updateTodo({
          id: editingTodo.id,
          text: editingTodo.text,
          category: editingTodo.category,
          completed: editingTodo.completed,
          description: editingTodo.description,
        }),
      );
      toast.success("Todo updated successfully");
      setEditingTodo(null);
    }
  };

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
          <Card key={todo.id} className="flex flex-col gap-2 p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* Checkbox for completion */}
                <Checkbox
                  checked={todo.completed}
                  onCheckedChange={() =>
                    dispatch(
                      updateTodo({ id: todo.id, completed: !todo.completed }),
                    )
                  }
                />
                <span
                  className={`text-lg ${todo.completed ? "text-muted-foreground line-through" : ""}`}
                >
                  {todo.text}
                </span>
                {/* Category */}
                {category && (
                  <Badge
                    className="ml-2"
                    style={{ backgroundColor: category.color }}
                  >
                    {category.name}
                  </Badge>
                )}
              </div>

              {/* Edit and delete buttons */}
              <div className="flex gap-2">
                <Dialog
                  open={!!editingTodo}
                  onOpenChange={() => setEditingTodo(null)}
                >
                  <DialogTrigger asChild>
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => handleEditTodo(todo)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <Input
                      value={editingTodo?.text || ""}
                      onChange={(e) =>
                        setEditingTodo({
                          ...editingTodo!,
                          text: e.target.value,
                        })
                      }
                      placeholder="Todo text"
                    />
                    <Textarea
                      value={editingTodo?.description || ""}
                      onChange={(e) =>
                        setEditingTodo({
                          ...editingTodo!,
                          description: e.target.value,
                        })
                      }
                      placeholder="Description"
                    />
                    <Select
                      value={editingTodo?.category || ""}
                      onValueChange={(value) =>
                        setEditingTodo({ ...editingTodo!, category: value })
                      }
                    >
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </Select>
                    <Button onClick={handleSaveTodo}>Save</Button>
                  </DialogContent>
                </Dialog>
                <Button
                  size="icon"
                  variant="destructive"
                  onClick={() => {
                    dispatch(removeTodo(todo.id));
                    toast.success("Todo deleted successfully");
                  }}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Collapsible for description */}
            {todo.description && (
              <>
                <Collapsible>
                  <CollapsibleTrigger className="text-muted-foreground cursor-pointer text-sm">
                    Details...
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <p className="mt-2 text-gray-700">{todo.description}</p>
                  </CollapsibleContent>
                </Collapsible>
              </>
            )}
          </Card>
        );
      })}
      <Toaster />
    </div>
  );
};

export default TodoList;
