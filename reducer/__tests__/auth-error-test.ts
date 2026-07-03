jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

import authReducer, { errorLoaded, logOut } from '../auth';
import { loginOrSignupError } from '../error';
import { User } from '../types';

const user: User = { id: 1, name: 'player', jwt: 'valid-jwt' };

describe('auth reducer', () => {
  it('keeps the user logged in on a generic server error', () => {
    expect(authReducer(user, errorLoaded('HTTP error! status: 500'))).toEqual(user);
  });

  it('clears the user on logout', () => {
    expect(authReducer(user, logOut())).toBeNull();
  });

  it('clears the user on a login or signup error', () => {
    expect(authReducer(user, loginOrSignupError('wrong password'))).toBeNull();
  });
});
