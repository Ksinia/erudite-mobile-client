jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

import authReducer, { jwtRefreshed } from '../auth';
import { User } from '../types';

const user: User = { id: 1, name: 'player', jwt: 'old-jwt', refreshToken: 'old-refresh' };

describe('auth reducer', () => {
  it('updates the jwt and refresh token after a token refresh', () => {
    const state = authReducer(
      user,
      jwtRefreshed({ jwt: 'new-jwt', refreshToken: 'new-refresh' })
    );

    expect(state).toEqual({ ...user, jwt: 'new-jwt', refreshToken: 'new-refresh' });
  });

  it('keeps the previous refresh token when the payload has none', () => {
    const state = authReducer(user, jwtRefreshed({ jwt: 'new-jwt' }));

    expect(state).toEqual({ ...user, jwt: 'new-jwt' });
  });

  it('ignores a token refresh when no user is logged in', () => {
    expect(authReducer(null, jwtRefreshed({ jwt: 'new-jwt' }))).toBeNull();
  });
});
