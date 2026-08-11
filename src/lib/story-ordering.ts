/**
 * Pure ordering logic, separated from DB access for easy testing. Per
 * your spec: newest-first overall, but stories the viewer has already
 * seen get pushed to the back of the list (still newest-first among
 * themselves).
 */
export type StoryForOrdering = {
  id: string;
  createdAt: Date;
  isViewedByCurrentUser: boolean;
};

export function orderStoriesForViewer<T extends StoryForOrdering>(stories: T[]): T[] {
  const unviewed = stories
    .filter((s) => !s.isViewedByCurrentUser)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  const viewed = stories
    .filter((s) => s.isViewedByCurrentUser)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  return [...unviewed, ...viewed];
}
