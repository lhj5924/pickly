import { renderHook, act } from '@testing-library/react';
import { useRecentSearches } from '@/hooks/useRecentSearches';
import { getRecentSearches } from '@/utils/recentSearchStorage';

beforeEach(() => {
  localStorage.clear();
});

describe('useRecentSearches', () => {
  it('initializes from localStorage', () => {
    localStorage.setItem('recent_searches', JSON.stringify(['a', 'b']));
    const { result } = renderHook(() => useRecentSearches());
    expect(result.current.items).toEqual(['a', 'b']);
  });

  it('add updates state immediately', () => {
    const { result } = renderHook(() => useRecentSearches());
    act(() => result.current.add('hello'));
    expect(result.current.items).toEqual(['hello']);
    expect(getRecentSearches()).toEqual(['hello']);
  });

  it('add deduplicates', () => {
    const { result } = renderHook(() => useRecentSearches());
    act(() => {
      result.current.add('a');
      result.current.add('b');
      result.current.add('a');
    });
    expect(result.current.items).toEqual(['a', 'b']);
  });

  it('remove updates state immediately', () => {
    localStorage.setItem('recent_searches', JSON.stringify(['a', 'b', 'c']));
    const { result } = renderHook(() => useRecentSearches());
    act(() => result.current.remove('b'));
    expect(result.current.items).toEqual(['a', 'c']);
    expect(getRecentSearches()).toEqual(['a', 'c']);
  });

  it('clear empties the list', () => {
    localStorage.setItem('recent_searches', JSON.stringify(['a', 'b']));
    const { result } = renderHook(() => useRecentSearches());
    act(() => result.current.clear());
    expect(result.current.items).toEqual([]);
    expect(getRecentSearches()).toEqual([]);
  });
});
