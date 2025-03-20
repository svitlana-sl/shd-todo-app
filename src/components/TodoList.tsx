import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../redux/store";
import { Todo, fetchTodos, removeTodo, updateTodo } from "../redux/todosSlice";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Pencil, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast, Toaster } from "sonner";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectItem,
  SelectContent,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

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

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [todosPerPage, setTodosPerPage] = useState(5);

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
      dispatch(updateTodo(editingTodo));
      toast.success("Todo updated successfully");
      setEditingTodo(null);
    }
  };

  // Pagination logic
  const totalTodos = todos.length;
  const totalPages = Math.ceil(totalTodos / todosPerPage);
  const indexOfLastTodo = currentPage * todosPerPage;
  const indexOfFirstTodo = indexOfLastTodo - todosPerPage;
  const currentTodos = todos.slice(indexOfFirstTodo, indexOfLastTodo);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  if (loading)
    return <p className="text-center text-gray-500">Loading todos...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;
  if (!todos.length)
    return <p className="text-center text-gray-500">No todos found.</p>;

  return (
    <div className="mx-auto mt-4 w-[800px] space-y-4">
      <div className="flex items-center justify-between"></div>

      <Accordion type="single" collapsible>
        {currentTodos.map((todo) => {
          const category = categories.find((cat) => cat.id === todo.category);

          return (
            <AccordionItem
              key={todo.id}
              value={todo.id.toString()}
              className="rounded-lg border p-4 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div className="flex w-full items-center gap-3">
                  <Checkbox
                    checked={todo.completed}
                    onCheckedChange={() =>
                      dispatch(
                        updateTodo({ ...todo, completed: !todo.completed }),
                      )
                    }
                  />
                  <span
                    className={`flex-grow text-lg ${todo.completed ? "text-muted-foreground text-stroke line-through" : ""}`}
                  >
                    {todo.text}
                  </span>

                  {category && (
                    <Badge
                      className="mr-2 ml-auto"
                      style={{ backgroundColor: category.color }}
                    >
                      {category.name}
                    </Badge>
                  )}

                  <AccordionTrigger className="cursor-pointer px-2 py-1">
                    ▼
                  </AccordionTrigger>
                </div>

                <div className="flex gap-2">
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => handleEditTodo(todo)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="destructive"
                    onClick={() => {
                      dispatch(removeTodo(todo.id));
                      toast.success("Todo deleted successfully");
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <AccordionContent>
                {editingTodo?.id === todo.id ? (
                  <div className="flex flex-col gap-2">
                    <Input
                      value={editingTodo.text}
                      onChange={(e) =>
                        setEditingTodo({ ...editingTodo, text: e.target.value })
                      }
                    />
                    <Textarea
                      value={editingTodo.description}
                      onChange={(e) =>
                        setEditingTodo({
                          ...editingTodo,
                          description: e.target.value,
                        })
                      }
                    />
                    <Button onClick={handleSaveTodo}>Save</Button>
                  </div>
                ) : (
                  <p className="mt-2 text-gray-700">{todo.description}</p>
                )}
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>

      <div className="flex items-center justify-between">
        {/* Show X per page select dropdown */}
        <div className="flex items-center gap-2">
          <span>Show:</span>
          <Select onValueChange={(value) => setTodosPerPage(Number(value))}>
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder={`${todosPerPage} per page`} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5 per page</SelectItem>
              <SelectItem value="10">10 per page</SelectItem>
              <SelectItem value="15">15 per page</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Pagination Controls */}
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => handlePageChange(currentPage - 1)}
                isActive={currentPage !== 1}
              />
            </PaginationItem>
            <PaginationItem>
              Page {currentPage} of {totalPages}
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                onClick={() => handlePageChange(currentPage + 1)}
                className={currentPage === totalPages ? "disabled" : ""}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      {/* Stats */}
      <div className="mt-4 flex justify-between text-sm text-gray-500">
        <span>Total: {totalTodos} todos</span>
        <span>
          Active: {todos.filter((todo) => !todo.completed).length} todos
        </span>
        <span>
          Completed: {todos.filter((todo) => todo.completed).length} todos
        </span>
        <span>
          {Math.round(
            (todos.filter((todo) => todo.completed).length / totalTodos) * 100,
          )}
          % completed
        </span>
      </div>

      <Toaster />
    </div>
  );
};

export default TodoList;
