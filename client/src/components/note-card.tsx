import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { Note } from "@/lib/types";
import { TodoList } from "./todo-list";
import { ExpirationBadge } from "./expiration-badge";
import { updateNote } from "@/lib/store";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

interface NoteCardProps {
  note: Note;
  onEdit: (note: Note) => void;
  onDelete: (id: string) => void;
}

export function NoteCard({ note, onEdit, onDelete }: NoteCardProps) {
  const { isExpiringSoon, neverExpires } = formatExpiration(note.expiresAt);
  
  const handleTodoToggle = (todoId: string, completed: boolean) => {
    if (!note.todos) return;
    
    const updatedNote = {
      ...note,
      todos: note.todos.map(todo => 
        todo.id === todoId ? { ...todo, completed } : todo
      )
    };
    
    updateNote(updatedNote);
  };

  return (
    <Card
      className={`note-card overflow-hidden transition-all hover:shadow-md hover:-translate-y-0.5 ${
        isExpiringSoon
          ? "border-orange-200 dark:border-orange-900/40"
          : neverExpires
            ? "border-primary-200 dark:border-primary-900/40"
            : "border-gray-200 dark:border-gray-800"
      }`}
    >
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-medium text-lg">{note.title}</h3>
          <div className="flex space-x-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              onClick={() => onEdit(note)}
            >
              <Pencil className="h-4 w-4" />
              <span className="sr-only">Edit note</span>
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-gray-400 hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Delete note</span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Note</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete this note? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={() => onDelete(note.id)}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
        
        {note.content && (
          <div className="prose dark:prose-invert prose-sm max-w-none mb-4">
            {note.content.split('\n').map((paragraph, idx) => (
              <p key={idx}>{paragraph}</p>
            ))}
          </div>
        )}
        
        {note.todos && note.todos.length > 0 && (
          <TodoList 
            todos={note.todos} 
            onToggle={handleTodoToggle} 
          />
        )}
        
        <ExpirationBadge expiresAt={note.expiresAt} />
      </CardContent>
    </Card>
  );
}

// Import here to avoid circular dependency
import { formatExpiration } from "@/lib/store";
