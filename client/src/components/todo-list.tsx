import { Checkbox } from "@/components/ui/checkbox";
import { TodoItem } from "@/lib/types";

interface TodoListProps {
  todos: TodoItem[];
  onToggle: (id: string, completed: boolean) => void;
  readonly?: boolean;
}

export function TodoList({ todos, onToggle, readonly = false }: TodoListProps) {
  if (!todos || todos.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2 mb-4">
      {todos.map((todo) => (
        <div key={todo.id} className="flex items-start space-x-2">
          <Checkbox
            id={`todo-${todo.id}`}
            checked={todo.completed}
            disabled={readonly}
            onCheckedChange={(checked) => {
              onToggle(todo.id, checked === true);
            }}
            className="mt-1"
          />
          <label
            htmlFor={`todo-${todo.id}`}
            className={`text-sm ${
              todo.completed
                ? "line-through text-gray-500 dark:text-gray-400"
                : "text-gray-700 dark:text-gray-300"
            }`}
          >
            {todo.text}
          </label>
        </div>
      ))}
    </div>
  );
}
