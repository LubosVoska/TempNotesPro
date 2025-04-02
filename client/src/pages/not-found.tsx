import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { DynamicTitle } from "@/components/dynamic-title";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <DynamicTitle 
        title="Page Not Found" 
        description="The page you are looking for doesn't exist. Return to the TempNotes home page to create and manage your notes."
      />
      <Card className="w-full max-w-md mx-4">
        <CardContent className="pt-6">
          <div className="flex mb-4 gap-2 items-center">
            <AlertCircle className="h-8 w-8 text-red-500" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Page Not Found</h1>
          </div>

          <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            The page you are looking for doesn't exist or has been moved.
          </p>
          
          <div className="mt-6">
            <Link href="/">
              <Button className="w-full">Return to Home</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
