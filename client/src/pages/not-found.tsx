import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background/50">
      <Card className="w-full max-w-md mx-4 hover:shadow-lg transition-shadow duration-200">
        <CardContent className="pt-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-full">
              <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <h1 className="text-2xl font-bold">Page Not Found</h1>
          </div>

          <p className="text-sm text-muted-foreground">
            The page you're looking for doesn't exist or has been moved.
          </p>

          <Link href="/">
            <Button className="w-full">
              Return to Dashboard
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}