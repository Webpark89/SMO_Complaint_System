import type { ReactNode } from "react";

import { useAuth } from "@/hooks/useAuth";

export function RequireAuth({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!user) {
    window.location.href = "/auth";
    return null;
  }

  return children;
}
