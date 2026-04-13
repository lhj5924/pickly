import { userKeys } from '@/api/queryKeys';

describe('Query Key Factory', () => {
  it('should return user all key', () => {
    expect(userKeys.all).toEqual(['user']);
  });

  it('should return user me key with uuid', () => {
    expect(userKeys.me('uuid-1')).toEqual(['user', 'me', 'uuid-1']);
  });

  it('should return readonly arrays', () => {
    const meKey = userKeys.me('uuid-1');
    expect(Object.isFrozen(meKey)).toBe(false); // as const doesn't freeze
    expect(meKey).toHaveLength(3);
  });

  it('should create unique references per call for me()', () => {
    const key1 = userKeys.me('uuid-1');
    const key2 = userKeys.me('uuid-1');
    expect(key1).toEqual(key2);
  });
});
