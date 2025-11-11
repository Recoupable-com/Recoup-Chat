"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type React from "react";

/**
 * ThemeProvider wraps the app to enable dark mode support
 * Uses next-themes to manage theme state and persistence
 */
export function ThemeProvider({ children, ...props }: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}

