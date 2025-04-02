import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { X, Plus, Tag } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { addNote, calculateExpirationFromPreset, updateNote } from "@/lib/store";
import { NoteFormValues, Note, TodoItem } from "@/lib/types";
import { v4 as uuidv4 } from "uuid";
import { format } from "date-fns";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().optional(),
  todos: z.array(
    z.object({
      id: z.string(),
      text: z.string(),
      completed: z.boolean(),
    })
  ),
  tags: z.array(z.string()).default([]),
  expirationType: z.enum(["preset", "custom"]),
  expirationPreset: z.string().optional(),
  customDate: z.string().optional(),
  customTime: z.string().optional(),
});

interface NoteFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingNote: Note | null;
}

export function NoteFormModal({ open, onOpenChange, editingNote }: NoteFormModalProps) {
  const [selectedPreset, setSelectedPreset] = useState<string>("1 day");
  
  // Set up form with default values
  const { control, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<NoteFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
      todos: [],
      tags: [],
      expirationType: "preset",
      expirationPreset: "1 day",
      customDate: format(new Date(), "yyyy-MM-dd"),
      customTime: format(new Date(), "HH:mm"),
    }
  });
  
  // Watch form values
  const expirationType = watch("expirationType");
  const todos = watch("todos");
  const tags = watch("tags");
  
  // Set form values when editing a note
  useEffect(() => {
    if (editingNote) {
      reset({
        title: editingNote.title,
        content: editingNote.content || "",
        todos: editingNote.todos || [],
        tags: editingNote.tags || [],
        expirationType: "preset", // Default to preset
        expirationPreset: "1 day", // Default preset
        customDate: format(new Date(editingNote.expiresAt), "yyyy-MM-dd"),
        customTime: format(new Date(editingNote.expiresAt), "HH:mm"),
      });
    } else {
      reset({
        title: "",
        content: "",
        todos: [],
        tags: [],
        expirationType: "preset",
        expirationPreset: "1 day",
        customDate: format(new Date(), "yyyy-MM-dd"),
        customTime: format(new Date(), "HH:mm"),
      });
    }
  }, [editingNote, reset, open]);
  
  // Add a new todo item
  const addTodoItem = () => {
    const newTodo: TodoItem = {
      id: uuidv4(),
      text: "",
      completed: false,
    };
    
    setValue("todos", [...todos, newTodo]);
  };
  
  // Remove a todo item
  const removeTodoItem = (id: string) => {
    setValue(
      "todos",
      todos.filter((todo) => todo.id !== id)
    );
  };
  
  // Handle preset selection
  const handlePresetSelect = (preset: string) => {
    setSelectedPreset(preset);
    setValue("expirationPreset", preset);
    setValue("expirationType", "preset");
  };
  
  // Handle form submission
  const onSubmit = (data: NoteFormValues) => {
    // Calculate expiration time
    let expiresAt: number;
    
    if (data.expirationType === "preset") {
      expiresAt = calculateExpirationFromPreset(data.expirationPreset || "1 day");
    } else {
      // Custom date and time
      if (!data.customDate || !data.customTime) {
        // Fallback to 1 day if custom date/time is invalid
        expiresAt = calculateExpirationFromPreset("1 day");
      } else {
        const dateTimeStr = `${data.customDate}T${data.customTime}`;
        expiresAt = new Date(dateTimeStr).getTime();
      }
    }
    
    // Filter out empty todo items
    const filteredTodos = data.todos.filter(todo => todo.text.trim() !== "");
    
    // Filter out empty tags
    const filteredTags = data.tags.filter(tag => tag.trim() !== "");
    
    if (editingNote) {
      // Update existing note
      updateNote({
        ...editingNote,
        title: data.title,
        content: data.content,
        todos: filteredTodos.length > 0 ? filteredTodos : undefined,
        tags: filteredTags,
        expiresAt,
      });
    } else {
      // Create new note
      addNote({
        title: data.title,
        content: data.content,
        todos: filteredTodos.length > 0 ? filteredTodos : undefined,
        tags: filteredTags,
        expiresAt,
      });
    }
    
    // Close modal and reset form
    onOpenChange(false);
    reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{editingNote ? "Edit Note" : "Create New Note"}</DialogTitle>
          <DialogDescription>
            {editingNote ? "Update your note details below." : "Add a new temporary note with optional todo items."}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Title */}
          <div className="space-y-1">
            <Label htmlFor="title">Title</Label>
            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <Input 
                  id="title" 
                  placeholder="Note title" 
                  {...field} 
                />
              )}
            />
            {errors.title && (
              <p className="text-xs text-destructive">{errors.title.message}</p>
            )}
          </div>
          
          {/* Content */}
          <div className="space-y-1">
            <Label htmlFor="content">Content</Label>
            <Controller
              name="content"
              control={control}
              render={({ field }) => (
                <Textarea 
                  id="content" 
                  placeholder="Write your note here..." 
                  rows={4} 
                  {...field} 
                />
              )}
            />
          </div>
          
          {/* Tags */}
          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <div className="flex items-center space-x-2">
              <div className="relative flex-grow">
                <Tag className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  id="tag-input"
                  placeholder="Add tags (comma separated)"
                  className="pl-8"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ',') {
                      e.preventDefault();
                      const input = e.currentTarget;
                      const value = input.value.trim();
                      
                      if (value && !tags.includes(value)) {
                        setValue("tags", [...tags, value]);
                        input.value = '';
                      }
                    }
                  }}
                  onBlur={(e) => {
                    const value = e.currentTarget.value.trim();
                    if (value && !tags.includes(value)) {
                      setValue("tags", [...tags, value]);
                      e.currentTarget.value = '';
                    }
                  }}
                />
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 mt-2">
              {tags.map((tag, index) => (
                <Badge 
                  key={index} 
                  variant="secondary"
                  className="px-2 py-1 flex items-center gap-1 text-xs"
                >
                  {tag}
                  <button 
                    type="button"
                    onClick={() => {
                      setValue("tags", tags.filter((_, i) => i !== index));
                    }}
                    className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 rounded-full"
                  >
                    <X className="h-3 w-3" />
                    <span className="sr-only">Remove tag</span>
                  </button>
                </Badge>
              ))}
            </div>
          </div>
          
          {/* Todo Items */}
          <div className="space-y-2">
            <Label>Todo Items</Label>
            
            <div className="space-y-2">
              <Controller
                name="todos"
                control={control}
                render={() => (
                  <div>
                    {todos.map((todo, index) => (
                      <div key={todo.id} className="flex items-center space-x-2 mb-2">
                        <Input
                          value={todo.text}
                          onChange={(e) => {
                            const newTodos = [...todos];
                            newTodos[index].text = e.target.value;
                            setValue("todos", newTodos);
                          }}
                          placeholder="Add a todo item"
                          className="flex-grow"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeTodoItem(todo.id)}
                          className="h-8 w-8 text-gray-400 hover:text-destructive"
                        >
                          <X className="h-4 w-4" />
                          <span className="sr-only">Remove todo</span>
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              />
              
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addTodoItem}
                className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400 flex items-center space-x-1"
              >
                <Plus className="h-4 w-4" />
                <span>Add Todo Item</span>
              </Button>
            </div>
          </div>
          
          {/* Expiration Settings */}
          <div className="space-y-3">
            <Label>Note Expiration</Label>
            
            {/* Default expiration options */}
            <div className="flex flex-wrap gap-2">
              {["1 hour", "6 hours", "1 day", "3 days", "1 week", "1 month", "Never expire"].map((preset) => (
                <Button
                  key={preset}
                  type="button"
                  variant={selectedPreset === preset ? "secondary" : "outline"}
                  size="sm"
                  onClick={() => handlePresetSelect(preset)}
                  className="text-xs h-7"
                >
                  {preset}
                </Button>
              ))}
            </div>
            
            {/* Custom date/time option */}
            <div className="flex items-center space-x-2">
              <Controller
                name="expirationType"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    id="custom-date-toggle"
                    checked={field.value === "custom"}
                    onCheckedChange={(checked) => {
                      setValue("expirationType", checked ? "custom" : "preset");
                    }}
                  />
                )}
              />
              <Label htmlFor="custom-date-toggle" className="text-sm">
                Set custom date and time
              </Label>
            </div>
            
            {/* Custom date/time inputs */}
            {expirationType === "custom" && (
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="expiration-date" className="text-xs">
                    Date
                  </Label>
                  <Controller
                    name="customDate"
                    control={control}
                    render={({ field }) => (
                      <Input
                        id="expiration-date"
                        type="date"
                        {...field}
                      />
                    )}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="expiration-time" className="text-xs">
                    Time
                  </Label>
                  <Controller
                    name="customTime"
                    control={control}
                    render={({ field }) => (
                      <Input
                        id="expiration-time"
                        type="time"
                        {...field}
                      />
                    )}
                  />
                </div>
              </div>
            )}
          </div>
          
          {/* Form Actions */}
          <div className="flex justify-end space-x-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              Save Note
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
