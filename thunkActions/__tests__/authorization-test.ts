jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

import AsyncStorage from '@react-native-async-storage/async-storage';
import { getProfileFetch } from '../authorization';

const dispatch = jest.fn();
const getState = jest.fn();

const runThunk = async () => {
  await getProfileFetch('stored-jwt')(dispatch, getState, undefined);
};

// Resolve fetch calls in order, so the /profile → /refresh → retry sequence
// can be exercised one response at a time.
const queueFetchResponses = (responses: Partial<Response>[]) => {
  const mock = jest.fn();
  responses.forEach((r) => mock.mockResolvedValueOnce(r));
  global.fetch = mock as unknown as typeof fetch;
  return mock;
};

const jsonResponse = (status: number, body: unknown): Partial<Response> => ({
  ok: status >= 200 && status < 300,
  status,
  statusText: `status ${status}`,
  json: async () => body,
});

const nonJsonResponse = (status: number): Partial<Response> => ({
  ok: status >= 200 && status < 300,
  status,
  statusText: `status ${status}`,
  json: async () => {
    throw new SyntaxError('Unexpected end of JSON input');
  },
});

describe('getProfileFetch', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    await AsyncStorage.clear();
  });

  it('keeps stored tokens on a network error', async () => {
    global.fetch = jest
      .fn()
      .mockRejectedValue(new TypeError('Network request failed')) as unknown as typeof fetch;

    await runThunk();

    expect(AsyncStorage.multiRemove).not.toHaveBeenCalled();
  });

  it('keeps stored tokens on a server error', async () => {
    queueFetchResponses([jsonResponse(500, {})]);

    await runThunk();

    expect(AsyncStorage.multiRemove).not.toHaveBeenCalled();
  });

  it('keeps stored tokens when the refresh fails transiently', async () => {
    await AsyncStorage.setItem('refreshToken', 'stored-refresh');
    // /profile 401, then /refresh 500 (transient): refreshTokens returns null.
    queueFetchResponses([jsonResponse(401, { message: 'jwt expired' }), jsonResponse(500, {})]);

    await runThunk();

    expect(AsyncStorage.multiRemove).not.toHaveBeenCalled();
  });

  it('keeps stored tokens when the retry after refresh fails transiently', async () => {
    await AsyncStorage.setItem('refreshToken', 'stored-refresh');
    queueFetchResponses([
      jsonResponse(401, { message: 'jwt expired' }),
      jsonResponse(200, { payload: { jwt: 'new-jwt', refreshToken: 'new-refresh' } }),
      jsonResponse(503, {}), // retry /profile transiently unavailable
    ]);

    await runThunk();

    expect(AsyncStorage.multiRemove).not.toHaveBeenCalled();
  });

  it('removes stored tokens when the refreshed token is also rejected', async () => {
    await AsyncStorage.setItem('refreshToken', 'stored-refresh');
    queueFetchResponses([
      jsonResponse(401, { message: 'jwt expired' }),
      jsonResponse(200, { payload: { jwt: 'new-jwt', refreshToken: 'new-refresh' } }),
      jsonResponse(401, { message: 'jwt expired' }), // fresh token rejected too
    ]);

    await runThunk();

    expect(AsyncStorage.multiRemove).toHaveBeenCalledWith(['jwt', 'refreshToken']);
  });

  it('reaches the 401 path even when the body is not JSON', async () => {
    await AsyncStorage.setItem('refreshToken', 'stored-refresh');
    // A 401 with an unparseable body must not divert into the token-keeping
    // catch: the retry with a refreshed token is still rejected, so tokens go.
    queueFetchResponses([
      nonJsonResponse(401),
      jsonResponse(200, { payload: { jwt: 'new-jwt', refreshToken: 'new-refresh' } }),
      nonJsonResponse(401),
    ]);

    await runThunk();

    expect(AsyncStorage.multiRemove).toHaveBeenCalledWith(['jwt', 'refreshToken']);
  });

  it('dispatches the profile with the jwt on success', async () => {
    queueFetchResponses([
      jsonResponse(200, { type: 'LOGIN_SUCCESS', payload: { id: 1, name: 'player' } }),
    ]);

    await runThunk();

    expect(dispatch).toHaveBeenCalledWith({
      type: 'LOGIN_SUCCESS',
      payload: { id: 1, name: 'player', jwt: 'stored-jwt' },
    });
    expect(AsyncStorage.multiRemove).not.toHaveBeenCalled();
  });
});
