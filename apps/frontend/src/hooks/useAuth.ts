// File Path: apps/frontend/src/hooks/useAuth.ts
"use client";

import { useContext } from "react";
import { AuthContext } from "@/contexts/AuthContext";

/**
 * A custom hook to provide easy access to the AuthContext.
 * It ensures that the context is used within an AuthProvider.
 * @returns The authentication context.
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
