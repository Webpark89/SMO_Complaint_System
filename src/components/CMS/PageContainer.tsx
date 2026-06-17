import type { ReactNode } from "react";
import { SiteHeader } from "./Header";

export function PageContainer({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen flex-col">
      <SiteHeader />
      <main className="flex-1 min-h-0">
        <div className="h-full overflow-y-auto">{children}</div>
      </main>
    </div>
  );
}
