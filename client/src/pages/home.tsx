import { useState, useEffect } from "react";
import { PlusCircle, StickyNote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { NoteCard } from "@/components/note-card";
import { EmptyState } from "@/components/empty-state";
import { NoteFormModal } from "@/components/note-form-modal";
import { useToast } from "@/hooks/use-toast";
import { getNotes, deleteNote } from "@/lib/store";
import { Note } from "@/lib/types";

export default function Home() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const { toast } = useToast();

  // Load notes on initial render and setup refresh interval
  useEffect(() => {
    loadNotes();
    
    // Set up interval to refresh notes every minute to update expirations
    const interval = setInterval(loadNotes, 60000);
    return () => clearInterval(interval);
  }, []);
  
  // Load notes from localStorage
  const loadNotes = () => {
    const loadedNotes = getNotes();
    setNotes(loadedNotes);
  };
  
  // Handle creating a new note
  const handleCreateNote = () => {
    setEditingNote(null);
    setIsModalOpen(true);
  };
  
  // Handle editing a note
  const handleEditNote = (note: Note) => {
    setEditingNote(note);
    setIsModalOpen(true);
  };
  
  // Handle deleting a note
  const handleDeleteNote = (id: string) => {
    deleteNote(id);
    loadNotes();
    
    toast({
      title: "Note deleted",
      description: "Your note has been permanently deleted.",
    });
  };
  
  // Handle modal close
  const handleModalOpenChange = (open: boolean) => {
    setIsModalOpen(open);
    
    if (!open) {
      setEditingNote(null);
      // Refresh notes when modal closes
      loadNotes();
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <StickyNote className="h-5 w-5 text-primary-500" />
            <h1 className="text-lg font-semibold">TempNotes</h1>
          </div>
          
          <div className="flex items-center space-x-3">
            <ThemeToggle />
            
            <Button onClick={handleCreateNote} className="flex items-center space-x-1">
              <PlusCircle className="h-4 w-4" />
              <span>New Note</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-6">
        {notes.length === 0 ? (
          <EmptyState onCreateNote={handleCreateNote} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {notes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                onEdit={handleEditNote}
                onDelete={handleDeleteNote}
              />
            ))}
          </div>
        )}
      </main>

      {/* Create/Edit Note Modal */}
      <NoteFormModal
        open={isModalOpen}
        onOpenChange={handleModalOpenChange}
        editingNote={editingNote}
      />
    </div>
  );
}
