import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes
    },
  },
});

export function clearUserSessionData() {
  // Clear all TanStack query cache immediately
  queryClient.clear();

  // Clear any cached lesson progress from localStorage
  try {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (
        key &&
        (key.startsWith('bitwise_cached_lesson_progress') ||
          key.startsWith('bitwise_progress_') ||
          key.startsWith('bitwise_mastery_') ||
          key.startsWith('bitwise_analytics_') ||
          key.startsWith('bitwise_lesson_'))
      ) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach((k) => localStorage.removeItem(k));
  } catch (err) {
    console.warn('Failed to clear cached lesson progress:', err);
  }
}
