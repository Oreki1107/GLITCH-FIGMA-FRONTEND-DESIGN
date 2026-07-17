import type { HomepageModuleModel } from '@/domain/shared/models';

export interface HomepageService {
  getModules(): Promise<HomepageModuleModel[]>;
}

export const homepageService: HomepageService = {
  async getModules() {
    return [];
  },
};
