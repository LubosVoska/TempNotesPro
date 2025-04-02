import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Note schema for localStorage structure
export const noteSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Title is required"),
  content: z.string().optional(),
  createdAt: z.number(),
  expiresAt: z.number(),
  todos: z.array(
    z.object({
      id: z.string(),
      text: z.string(),
      completed: z.boolean().default(false),
    })
  ).optional(),
});

export type Note = z.infer<typeof noteSchema>;
