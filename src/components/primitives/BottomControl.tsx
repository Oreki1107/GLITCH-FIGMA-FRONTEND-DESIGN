import type { ReactNode } from "react";
import { SystemLabel } from "./SystemLabel";

type BottomControlProps = {
  icon: ReactNode;
  label: string;
  onClick: () => void;
  active?: boolean;
};

export function BottomControl({ icon, label, onClick, active = false }: BottomControlProps) {
  return (
    <button
      onClick={onClick}
      className={`flex h-14 items-center gap-2 border px-3 transition active:scale-95 ${
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-white/20 bg-[#111114]/95 text-foreground backdrop-blur-xl hover:border-white/50"
      }`}
    >
      {icon}
      <SystemLabel>{label}</SystemLabel>
    </button>
  );
}
