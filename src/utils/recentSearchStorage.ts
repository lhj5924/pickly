const STORAGE_KEY = 'recent_searches';
const MAX_ITEMS = 10;

export function getRecentSearches(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item): item is string => typeof item === 'string');
  } catch {
    return [];
  }
}

export function addRecentSearch(query: string): void {
  try {
    const searches = getRecentSearches();
    const filtered = searches.filter(item => item !== query);
    const updated = [query, ...filtered].slice(0, MAX_ITEMS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // private browsing or storage full
  }
}

export function removeRecentSearch(query: string): void {
  try {
    const searches = getRecentSearches();
    const updated = searches.filter(item => item !== query);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // private browsing or storage full
  }
}

export function clearRecentSearches(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // private browsing or storage full
  }
}
