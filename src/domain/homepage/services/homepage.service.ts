import type { GlitchHomeModule } from '@/domain/types';

export interface HomepageService {
  getModules(): Promise<GlitchHomeModule[]>;
}

export const homepageService: HomepageService = {
  async getModules() {
    return [];
  },
};
