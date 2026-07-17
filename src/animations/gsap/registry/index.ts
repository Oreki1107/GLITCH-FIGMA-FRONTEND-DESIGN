export const gsapTimelineRegistry = new Map<string, unknown>();

export function registerGsapTimeline(id: string, timeline: unknown) {
  gsapTimelineRegistry.set(id, timeline);
}
