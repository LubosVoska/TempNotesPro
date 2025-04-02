import { useEffect } from 'react';

interface JsonLdProps {
  data: Record<string, any>;
}

export function JsonLd({ data }: JsonLdProps) {
  useEffect(() => {
    // Create script element for JSON-LD
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(data);
    script.id = 'json-ld-' + Math.random().toString(36).substring(2, 9); // Unique ID
    
    // Add to document head
    document.head.appendChild(script);
    
    // Clean up when component unmounts
    return () => {
      document.head.removeChild(script);
    };
  }, [data]);
  
  return null;
}