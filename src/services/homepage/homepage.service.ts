import type { GlitchHomeModule } from "@/domain/types";

export type IHomepageService = {
  getModules(): Promise<GlitchHomeModule[]>;
};
