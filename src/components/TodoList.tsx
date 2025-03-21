import { useState } from "react";
import { toast, Toaster } from "sonner";
import {
  useGetTodosQuery,
  useCreateTodoMutation,
  useUpdateTodoMutation,
  useRemoveTodoMutation,
} from "../redux/apiSlice";
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
  // Fetch todos
  const { data: todos = [], isLoading, error } = useGetTodosQuery();
  // Create, update, and delete mutations
  const [createTodo] = useCreateTodoMutation();
  const [updateTodo] = useUpdateTodoMutation();
  const [removeTodo] = useRemoveTodoMutation();

  // Local state for categories, editing, pagination, filters, and modals
  const [categories, setCategories] = useState<Category[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<any>(null);
  const [editText, setEditText] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [newTodo, setNewTodo] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [todosPerPage, setTodosPerPage] = useState(5);
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);

  // Load categories from API on mount
  useState(() => {
    fetch("https://locrian-sand-eyebrow.glitch.me/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error("Failed to fetch categories", err));
  });

  // Handler for adding a new todo using mutation
  const handleAddTodo = async () => {
    if (!newTodo.trim() || !selectedCategory) {
      toast.error("Please enter a todo and select a category!");
      return;
    }

    const newTodoItem = {
      // Temporary id is not needed — backend should assign one
      text: newTodo,
      category: selectedCategory,
      completed: false,
    };

    try {
      await createTodo(newTodoItem).unwrap();
      toast.success("Todo added successfully");
      setNewTodo("");
      setSelectedCategory("");
    } catch (err) {
      toast.error("Failed to add todo");
    }
  };

  // Handler for editing a todo
  const handleEditTodo = (todo: any) => {
    setEditingTodo(todo);
    setEditText(todo.text);
    setEditDescription(todo.description || "");
    setIsModalOpen(true);
  };

  // Handler for saving the edited todo using mutation
  const handleSaveTodo = async () => {
    if (editingTodo) {
      try {
        await updateTodo({
          ...editingTodo,
          text: editText,
          description: editDescription,
        }).unwrap();
        toast.success("Todo updated successfully");
        setIsModalOpen(false);
      } catch (err) {
        toast.error("Failed to update todo");
      }
    }
  };

  // Handler for deleting a todo
  const handleDeleteTodo = async (id: number) => {
    try {
      await removeTodo(id).unwrap();
      toast.success("Todo deleted successfully");
    } catch (err) {
      toast.error("Failed to delete todo");
    }
  };

  // Pagination logic and filtering
  const totalTodos = todos.length;
  const totalPages = Math.ceil(totalTodos / todosPerPage);
  const indexOfLastTodo = currentPage * todosPerPage;
  const indexOfFirstTodo = indexOfLastTodo - todosPerPage;

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

  const currentTodos = [...filteredTodos]
    .reverse()
    .slice(indexOfFirstTodo, indexOfLastTodo);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  if (isLoading)
    return <p className="text-center text-gray-500">Loading todos...</p>;
  if (error)
    return <p className="text-center text-red-500">Error loading todos</p>;
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

      {/* Filter Dropdowns */}
      <div className="flex justify-between gap-4">
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

      {/* Display Todos in an Accordion */}
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
                      updateTodo({ ...todo, completed: !todo.completed })
                    }
                  />
                  <span
                    className={`flex-grow text-lg ${todo.completed ? "text-muted-foreground line-through" : ""}`}
                  >
                    {todo.text}
                  </span>
                  {category && (
                    <Badge style={{ backgroundColor: category.color }}>
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
                    onClick={() => handleDeleteTodo(todo.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
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

      {/* Pagination */}
      <div className="flex items-center justify-between">
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

      {/* Stats Section */}
      <div className="mt-4 flex justify-between text-sm text-gray-500">
        <span>Total: {totalTodos} todos</span>
        <span>Active: {todos.filter((t) => !t.completed).length} todos</span>
        <span>Completed: {todos.filter((t) => t.completed).length} todos</span>
        <span>
          {Math.round(
            (todos.filter((t) => t.completed).length / totalTodos) * 100,
          )}
          % completed
        </span>
      </div>

      {/* Edit Todo Dialog */}
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
