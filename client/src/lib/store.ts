import { Note } from "./types";
import { formatDistanceToNow, isPast, parseISO, format, addHours, addDays, addMonths } from "date-fns";
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY = "tempnotes-data";

// Get notes from localStorage
export const getNotes = (): Note[] => {
  try {
    const notes = localStorage.getItem(STORAGE_KEY);
    if (!notes) return [];
    
    const parsedNotes = JSON.parse(notes) as Note[];
    
    // Filter out expired notes
    return parsedNotes.filter(note => {
      return !isPast(note.expiresAt);
    });
  } catch (error) {
    console.error("Error loading notes from localStorage:", error);
    return [];
  }
};

// Save notes to localStorage
export const saveNotes = (notes: Note[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
};

// Add a new note
export const addNote = (note: Omit<Note, "id" | "createdAt">): Note => {
  const newNote: Note = {
    ...note,
    id: uuidv4(),
    createdAt: Date.now(),
  };
  
  const notes = getNotes();
  saveNotes([...notes, newNote]);
  
  return newNote;
};

// Update an existing note
export const updateNote = (updatedNote: Note): Note => {
  const notes = getNotes();
  const updatedNotes = notes.map(note => 
    note.id === updatedNote.id ? updatedNote : note
  );
  
  saveNotes(updatedNotes);
  return updatedNote;
};

// Delete a note
export const deleteNote = (id: string): void => {
  const notes = getNotes();
  const updatedNotes = notes.filter(note => note.id !== id);
  
  saveNotes(updatedNotes);
};

// Calculate expiration time from preset
export const calculateExpirationFromPreset = (preset: string): number => {
  const now = new Date();
  
  switch (preset) {
    case "1 hour":
      return addHours(now, 1).getTime();
    case "6 hours":
      return addHours(now, 6).getTime();
    case "1 day":
      return addDays(now, 1).getTime();
    case "3 days":
      return addDays(now, 3).getTime();
    case "1 week":
      return addDays(now, 7).getTime();
    case "1 month":
      return addMonths(now, 1).getTime();
    case "Never expire":
      // Use a very distant future date (100 years from now)
      return addMonths(now, 1200).getTime(); // 100 years
    default:
      return addDays(now, 1).getTime(); // Default to 1 day
  }
};

// Format expiration time for display
export const formatExpiration = (expiresAt: number): { text: string; isExpiringSoon: boolean; neverExpires: boolean } => {
  const now = new Date();
  const expirationDate = new Date(expiresAt);
  
  // Check if this is a "Never expire" note (100 years in the future)
  const yearsInFuture = (expirationDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24 * 365);
  if (yearsInFuture > 99) {
    return {
      text: "Never",
      isExpiringSoon: false,
      neverExpires: true
    };
  }
  
  // Check if expiring in less than 24 hours
  const isExpiringSoon = expirationDate.getTime() - now.getTime() < 24 * 60 * 60 * 1000;
  
  // Format based on how far in the future
  if (expirationDate.getTime() - now.getTime() < 48 * 60 * 60 * 1000) {
    // Less than 2 days, show relative time
    return {
      text: formatDistanceToNow(expirationDate, { addSuffix: false }),
      isExpiringSoon,
      neverExpires: false
    };
  } else {
    // More than 2 days, show date and time
    return {
      text: format(expirationDate, "EEE, MMM d, h:mm a"),
      isExpiringSoon,
      neverExpires: false
    };
  }
};
