import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../redux/store";
import {
  Todo,
  fetchTodos,
  removeTodo,
  updateTodo,
  addTodo,
  createTodo,
} from "../redux/todosSlice";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import { Pencil, X } from "lucide-react";
import { Input } from "@/components/ui/input";
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
import { Textarea } from "@/components/ui/textarea";

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [editText, setEditText] = useState("");
  const [editDescription, setEditDescription] = useState("");

  // State for adding a new todo
  const [newTodo, setNewTodo] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [todosPerPage, setTodosPerPage] = useState(5);

  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchTodos());

    fetch("http://localhost:5000/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error("Failed to fetch categories", err));
  }, [dispatch]);

  const handleAddTodo = () => {
    if (!newTodo.trim() || !selectedCategory) {
      toast.error("Please enter a todo and select a category!");
      return;
    }

    const newTodoItem: Todo = {
      id: Date.now(), // Temporary id; backend will return a permanent id
      text: newTodo,
      category: selectedCategory,
      completed: false,
    };

    // Dispatch the async thunk for creating a new todo in the backend
    dispatch(createTodo(newTodoItem));
    toast.success("Todo added successfully");

    // Reset fields after adding
    setNewTodo("");
    setSelectedCategory("");
  };

  const handleEditTodo = (todo: Todo) => {
    setEditingTodo(todo);
    setEditText(todo.text);
    setEditDescription(todo.description || "");
    setIsModalOpen(true);
  };

  const handleSaveTodo = () => {
    if (editingTodo) {
      dispatch(
        updateTodo({
          ...editingTodo,
          text: editText,
          description: editDescription,
        }),
      );
      toast.success("Todo updated successfully");
      setIsModalOpen(false);
    }
  };

  // Pagination logic
  const totalTodos = todos.length;
  const totalPages = Math.ceil(totalTodos / todosPerPage);
  const indexOfLastTodo = currentPage * todosPerPage;
  const indexOfFirstTodo = indexOfLastTodo - todosPerPage;

  // Todo filtering
  const filteredTodos = todos.filter((todo) => {
    const matchesCategory =
      filterCategory && filterCategory !== "all"
        ? todo.category === filterCategory
        : true;
    const matchesStatus =
      filterStatus && filterStatus !== "all"
        ? filterStatus === "completed"
          ? todo.completed
          : !todo.completed
        : true;
    return matchesCategory && matchesStatus;
  });

  // Slice the filtered todos for pagination
  const currentTodos = [...filteredTodos]
    .reverse()
    .slice(indexOfFirstTodo, indexOfLastTodo);

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
      {/* Add Todo Form */}
      <div className="flex items-center gap-2">
        <Input
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add a new todo..."
          className="flex-grow"
        />

        <Select onValueChange={(value) => setSelectedCategory(value)}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button onClick={handleAddTodo} className="bg-black text-white">
          + Add
        </Button>
      </div>

      <div className="flex justify-between gap-4">
        {/* Filter by Category */}
        <div className="flex items-center gap-2">
          <span className="text-sm">Filter by Category:</span>
          <Select onValueChange={(value) => setFilterCategory(value)}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Filter by Status */}
        <div className="flex items-center gap-2">
          <span className="text-sm">Filter by Status:</span>
          <Select onValueChange={(value) => setFilterStatus(value)}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Display Todos */}
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
                    className={`flex-grow text-lg ${todo.completed ? "text-muted-foreground line-through" : ""}`}
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

                  <AccordionTrigger className="cursor-pointer px-2 py-1" />
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
                    variant="outline"
                    onClick={() => dispatch(removeTodo(todo.id))}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* AccordionContent to show description */}
              <AccordionContent>
                <div className="mt-2">
                  <p className="text-gray-700">
                    {todo.description || "No description"}
                  </p>
                </div>
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
          )}{" "}
          % completed
        </span>
      </div>

      {/* Edit Todo Dialog - triggers on pencil icon click */}
      {editingTodo && (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Todo</DialogTitle>
            </DialogHeader>
            <Input
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              placeholder="Todo Title"
            />
            <Textarea
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              placeholder="Description"
            />
            <DialogFooter>
              <Button onClick={handleSaveTodo}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      <Toaster />
    </div>
  );
};

export default TodoList;
