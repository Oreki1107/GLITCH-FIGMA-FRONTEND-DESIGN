import type { ReactNode } from "react";

type SystemLabelProps = {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
};

export function SystemLabel({ children, className = "", style }: SystemLabelProps) {
  return (
    <span
      style={style}
      className={`font-mono text-[10px] uppercase tracking-[0.16em] ${className}`}
    >
      {children}
    </span>
  );
}
