import type { ReactNode } from "react";
import { SystemLabel } from "./SystemLabel";

type SectionHeadingProps = {
  kicker: string;
  title: ReactNode;
  action?: ReactNode;
};

export function SectionHeading({ kicker, title, action }: SectionHeadingProps) {
  return (
    <div className="mb-9 flex items-end justify-between gap-4 border-b border-border pb-4">
      <div>
        <SystemLabel className="text-primary">{kicker}</SystemLabel>
        <h2 className="mt-2 font-['Archivo_Black'] text-4xl lowercase leading-[.86] tracking-[-.075em] md:text-6xl">
          {title}
        </h2>
      </div>
      {action}
    </div>
  );
}
