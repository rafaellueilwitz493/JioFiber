"use client";

import * as React from "react";
import { ThemeProvider as NextThemeProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemeProvider {...props}>{children}</NextThemeProvider>;
}

export const useTheme = () => {
  const [theme, setTheme] = React.useState<string>("light");

  const toggleTheme = React.useCallback(() => {
    setTheme(prev => prev === "light" ? "dark" : "light");
    document.documentElement.classList.toggle("dark");
  }, []);

  return {
    theme,
    setTheme: (newTheme: string) => {
      setTheme(newTheme);
      document.documentElement.classList.toggle("dark", newTheme === "dark");
    },
  };
};
