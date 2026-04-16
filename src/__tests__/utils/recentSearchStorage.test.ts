import {
  getRecentSearches,
  addRecentSearch,
  removeRecentSearch,
  clearRecentSearches,
} from '@/utils/recentSearchStorage';

beforeEach(() => {
  localStorage.clear();
});

describe('getRecentSearches', () => {
  it('returns empty array when localStorage is empty', () => {
    expect(getRecentSearches()).toEqual([]);
  });

  it('returns empty array when localStorage has invalid JSON', () => {
    localStorage.setItem('recent_searches', 'not-json');
    expect(getRecentSearches()).toEqual([]);
  });

  it('returns empty array when localStorage has non-array', () => {
    localStorage.setItem('recent_searches', '{"a":1}');
    expect(getRecentSearches()).toEqual([]);
  });

  it('filters out non-string values', () => {
    localStorage.setItem('recent_searches', '["valid", 123, null, "also valid"]');
    expect(getRecentSearches()).toEqual(['valid', 'also valid']);
  });
});

describe('addRecentSearch', () => {
  it('adds a new search term', () => {
    addRecentSearch('react');
    expect(getRecentSearches()).toEqual(['react']);
  });

  it('deduplicates and moves existing query to top', () => {
    addRecentSearch('first');
    addRecentSearch('second');
    addRecentSearch('first');
    expect(getRecentSearches()).toEqual(['first', 'second']);
  });

  it('drops oldest when exceeding 10 items', () => {
    for (let i = 1; i <= 11; i++) {
      addRecentSearch(`query${i}`);
    }
    const result = getRecentSearches();
    expect(result).toHaveLength(10);
    expect(result[0]).toBe('query11');
    expect(result[9]).toBe('query2');
    expect(result).not.toContain('query1');
  });
});

describe('removeRecentSearch', () => {
  it('removes only the target item', () => {
    addRecentSearch('a');
    addRecentSearch('b');
    addRecentSearch('c');
    removeRecentSearch('b');
    expect(getRecentSearches()).toEqual(['c', 'a']);
  });

  it('does nothing if target not found', () => {
    addRecentSearch('a');
    removeRecentSearch('nonexistent');
    expect(getRecentSearches()).toEqual(['a']);
  });
});

describe('clearRecentSearches', () => {
  it('empties the list', () => {
    addRecentSearch('a');
    addRecentSearch('b');
    clearRecentSearches();
    expect(getRecentSearches()).toEqual([]);
  });
});
