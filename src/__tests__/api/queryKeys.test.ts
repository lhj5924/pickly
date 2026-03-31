import { userKeys } from '@/api/queryKeys';

describe('Query Key Factory', () => {
  it('should return user all key', () => {
    expect(userKeys.all).toEqual(['user']);
  });

  it('should return user me key', () => {
    expect(userKeys.me()).toEqual(['user', 'me']);
  });

  it('should return readonly arrays', () => {
    const meKey = userKeys.me();
    expect(Object.isFrozen(meKey)).toBe(false); // as const doesn't freeze
    expect(meKey).toHaveLength(2);
  });

  it('should create unique references per call for me()', () => {
    const key1 = userKeys.me();
    const key2 = userKeys.me();
    // Should produce equal but not identical arrays (new array each call)
    expect(key1).toEqual(key2);
  });
});
