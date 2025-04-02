import { useState, useEffect, useMemo } from "react";
import { PlusCircle, StickyNote, Search, X, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { NoteCard } from "@/components/note-card";
import { EmptyState } from "@/components/empty-state";
import { NoteFormModal } from "@/components/note-form-modal";
import { GoogleAdSense } from "@/components/google-adsense";
import { DynamicTitle } from "@/components/dynamic-title";
import { JsonLd } from "@/components/json-ld";
import { useToast } from "@/hooks/use-toast";
import { getNotes, deleteNote } from "@/lib/store";
import { Note } from "@/lib/types";

export default function Home() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const { toast } = useToast();
  
  // Get all unique tags from notes
  const allTags = useMemo(() => {
    const tagsSet = new Set<string>();
    notes.forEach(note => {
      if (note.tags && note.tags.length > 0) {
        note.tags.forEach(tag => tagsSet.add(tag));
      }
    });
    return Array.from(tagsSet).sort();
  }, [notes]);
  
  // Filter notes based on search query and selected tags
  const filteredNotes = useMemo(() => {
    return notes.filter(note => {
      // Filter by search query
      const matchesSearch = searchQuery === "" || 
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        (note.content && note.content.toLowerCase().includes(searchQuery.toLowerCase()));
      
      // Filter by selected tags
      const matchesTags = selectedTags.length === 0 || 
        (note.tags && selectedTags.every(tag => note.tags.includes(tag)));
      
      return matchesSearch && matchesTags;
    });
  }, [notes, searchQuery, selectedTags]);

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
  
  // Toggle tag selection for filtering
  const toggleTagSelection = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag) 
        : [...prev, tag]
    );
  };
  
  // Clear all filters
  const clearFilters = () => {
    setSearchQuery("");
    setSelectedTags([]);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <DynamicTitle 
        title="Home" 
        description="Create temporary notes with customizable expiration times, todo lists, and tagging for better organization. Your data stays in your browser for privacy."
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "TempNotes",
          "description": "Create temporary notes with customizable expiration times, todo lists, and tagging for better organization. Your data stays in your browser for privacy.",
          "applicationCategory": "Productivity",
          "operatingSystem": "Any",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
          },
          "featureList": [
            "Temporary notes with expiration times",
            "Todo lists within notes",
            "Tag-based organization",
            "Dark and light themes",
            "Privacy-focused with browser storage only"
          ]
        }}
      />
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex flex-col gap-2">
          <div className="flex items-center justify-between">
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
          
          {/* Search and filter bar */}
          {notes.length > 0 && (
            <div className="flex flex-col md:flex-row gap-2 md:items-center">
              <div className="relative flex-grow max-w-md">
                <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search notes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 pr-8"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-500"
                  >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Clear search</span>
                  </button>
                )}
              </div>
              
              {allTags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 items-center">
                  <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                    <Tag className="h-3.5 w-3.5 mr-1" />
                    Filter:
                  </span>
                  
                  {allTags.map(tag => (
                    <Badge
                      key={tag}
                      variant={selectedTags.includes(tag) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => toggleTagSelection(tag)}
                    >
                      {tag}
                    </Badge>
                  ))}
                  
                  {(selectedTags.length > 0 || searchQuery) && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearFilters}
                      className="ml-1 h-7 px-2 text-xs"
                    >
                      Clear all
                    </Button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-6">
        {/* Top AdSense Banner */}
        <div className="mb-6">
          <GoogleAdSense 
            slot="1234567890" 
            format="horizontal" 
            style={{ minHeight: "90px" }}
            className="mx-auto rounded-md overflow-hidden border border-gray-200 dark:border-gray-800"
          />
        </div>

        {notes.length === 0 ? (
          <EmptyState onCreateNote={handleCreateNote} />
        ) : filteredNotes.length === 0 ? (
          <div className="text-center py-10">
            <div className="text-gray-400 dark:text-gray-500 mb-3">
              <Search className="h-10 w-10 mx-auto" />
            </div>
            <h3 className="text-lg font-medium mb-1">No matching notes found</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Try adjusting your search or filter criteria
            </p>
            <Button variant="outline" onClick={clearFilters}>
              Clear all filters
            </Button>
            
            {/* Empty Search Results AdSense */}
            <div className="max-w-md mx-auto mt-8">
              <GoogleAdSense 
                slot="6543219870" 
                format="rectangle" 
                style={{ minHeight: "250px" }}
                className="mx-auto rounded-md overflow-hidden border border-gray-200 dark:border-gray-800"
              />
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredNotes.map((note) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  onEdit={handleEditNote}
                  onDelete={handleDeleteNote}
                />
              ))}
            </div>

            {/* Bottom AdSense Banner */}
            {filteredNotes.length > 3 && (
              <div className="mt-8">
                <GoogleAdSense 
                  slot="9876543210" 
                  format="horizontal" 
                  style={{ minHeight: "90px" }}
                  className="mx-auto rounded-md overflow-hidden border border-gray-200 dark:border-gray-800"
                />
              </div>
            )}
          </>
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
