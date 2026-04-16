import { useState, useCallback } from 'react';
import {
  getRecentSearches,
  addRecentSearch,
  removeRecentSearch,
  clearRecentSearches,
} from '@/utils/recentSearchStorage';

export function useRecentSearches() {
  const [items, setItems] = useState<string[]>(() => getRecentSearches());

  const add = useCallback((query: string) => {
    addRecentSearch(query);
    setItems(getRecentSearches());
  }, []);

  const remove = useCallback((query: string) => {
    removeRecentSearch(query);
    setItems(getRecentSearches());
  }, []);

  const clear = useCallback(() => {
    clearRecentSearches();
    setItems([]);
  }, []);

  return { items, add, remove, clear };
}
