import { Moon, Sun, Signal } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";

export function TopBar() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="flex h-16 items-center px-6 container mx-auto">
        <div className="flex items-center space-x-2">
          <Signal className="h-6 w-6 text-primary" />
          <div className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Jio Fiber Manager
          </div>
        </div>
        <div className="ml-auto flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          >
            {theme === "light" ? (
              <Moon className="h-5 w-5 hover:text-primary transition-colors" />
            ) : (
              <Sun className="h-5 w-5 hover:text-primary transition-colors" />
            )}
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
      </div>
    </div>
  );
}