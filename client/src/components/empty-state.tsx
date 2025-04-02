import { StickyNote } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  onCreateNote: () => void;
}

export function EmptyState({ onCreateNote }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center space-y-4 py-20">
      <div className="w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-500">
        <StickyNote className="h-8 w-8" />
      </div>
      <h2 className="text-xl font-semibold">No notes yet</h2>
      <p className="text-gray-500 dark:text-gray-400 max-w-md">
        Create your first temporary note by clicking the "New Note" button above.
      </p>
      <Button
        className="mt-2"
        onClick={onCreateNote}
      >
        Create a Note
      </Button>
    </div>
  );
}
