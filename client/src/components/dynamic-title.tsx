import { useEffect } from 'react';

interface DynamicTitleProps {
  title: string;
  description?: string;
}

export function DynamicTitle({ title, description }: DynamicTitleProps) {
  useEffect(() => {
    // Update the document title
    const originalTitle = document.title;
    document.title = `${title} | TempNotes`;

    // Update meta description if provided
    if (description) {
      const metaDescription = document.querySelector('meta[name="description"]');
      const originalDescription = metaDescription?.getAttribute('content') || '';
      
      if (metaDescription) {
        metaDescription.setAttribute('content', description);
      }

      // Cleanup function to restore original values
      return () => {
        document.title = originalTitle;
        if (metaDescription) {
          metaDescription.setAttribute('content', originalDescription);
        }
      };
    }

    // Cleanup function to restore original title
    return () => {
      document.title = originalTitle;
    };
  }, [title, description]);

  // This component doesn't render anything
  return null;
}