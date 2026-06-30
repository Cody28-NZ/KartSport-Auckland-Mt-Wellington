import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface CardGridProps {
  children: ReactNode;
  columns?: 1 | 2 | 3 | 4;
  className?: string;
}

const columnStyles = {
  1: "grid-cols-1",
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
};

export function CardGrid({ children, columns = 3, className }: CardGridProps) {
  return (
    <div className={cn("grid gap-6", columnStyles[columns], className)}>
      {children}
    </div>
  );
}
