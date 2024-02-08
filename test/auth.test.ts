import { createQueryExecutor } from 'graphql-client-utilities';
import { describe, expect, test } from 'vitest';
import { getSessionData, login } from '../src/lib/auth';
import { API_URL, queryExecutor } from './query-executor';

describe('Tests generales para auth', async () => {
  test('Test login and session data', async () => {
    const username = 'p.lopez';
    const password = 'demo###';
    const result = await login(queryExecutor, username, password);
    expect(result?.user.fullName).toBeTruthy();
    const jwt = result?.jwt;
    expect(jwt).toBeTruthy();
    const options: RequestInit = {
      headers: {
        Authorization: `Bearer ${jwt}`
      }
    };
    const queryExecutorAuth = createQueryExecutor(API_URL, undefined, options);

    let sessionData;
    try {
      sessionData = await getSessionData(queryExecutorAuth);
    } catch (error) {
      console.log('ERROR', error);
    }

    expect(sessionData?.user.username).toBeTruthy();
  });
});
