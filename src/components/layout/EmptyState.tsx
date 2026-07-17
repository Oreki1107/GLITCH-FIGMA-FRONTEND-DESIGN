import type { ReactNode } from "react";
import { SystemLabel } from "@/components/primitives";

type EmptyStateProps = {
  kicker: string;
  description?: string;
  children?: ReactNode;
};

export function EmptyState({ kicker, description, children }: EmptyStateProps) {
  return (
    <div className="border border-dashed border-white/25 p-8">
      <SystemLabel className="text-primary">{kicker}</SystemLabel>
      {description && (
        <p className="mt-3 max-w-xs text-sm leading-6 text-muted-foreground">{description}</p>
      )}
      {children}
    </div>
  );
}
