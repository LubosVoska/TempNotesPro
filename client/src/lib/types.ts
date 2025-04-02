import { z } from "zod";
import { noteSchema } from "@shared/schema";

export type Note = z.infer<typeof noteSchema>;

export type TodoItem = {
  id: string;
  text: string;
  completed: boolean;
};

export interface NoteFormValues {
  title: string;
  content: string;
  todos: TodoItem[];
  expirationType: "preset" | "custom";
  expirationPreset: string;
  customDate: string;
  customTime: string;
}

export type Theme = "light" | "dark" | "system";
