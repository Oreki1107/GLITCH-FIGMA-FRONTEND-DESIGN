import type { CollectionModel } from "@/domain/shared/models";
import { SystemLabel } from "@/components/primitives";

type CollectionTabsProps = {
  collections: GlychCollection[];
  activeCollection: string;
  onSelect: (collection: string) => void;
};

export function CollectionTabs({ collections, activeCollection, onSelect }: CollectionTabsProps) {
  return (
    <div className="mb-8 flex gap-2 overflow-x-auto pb-1">
      {["all", ...collections.map((item) => item.title)].map((item) => (
        <button
          key={item}
          onClick={() => onSelect(item)}
          className={`shrink-0 border px-3 py-2 ${
            activeCollection === item
              ? "border-primary bg-primary text-primary-foreground"
              : "border-white/20 text-muted-foreground"
          }`}
        >
          <SystemLabel>{item}</SystemLabel>
        </button>
      ))}
    </div>
  );
}
