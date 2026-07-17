import { homepageModuleConfig, type HomepageModuleConfig } from "./homepage-modules.config";

export function getHomepageModule<T extends HomepageModuleConfig["type"]>(
  type: T,
): Extract<HomepageModuleConfig, { type: T }> | undefined {
  const module = homepageModuleConfig.find((item) => item.type === type);
  return module as Extract<HomepageModuleConfig, { type: T }> | undefined;
}
