import { describe, expect, test } from 'vitest';
import { login } from '../src/lib/auth';
import { queryExecutor } from './query-executor';

describe('Tests generales para auth', async () => {
  test('Test login', async () => {
    const username = 'p.lopez';
    const password = 'demo###';
    const result = await login(queryExecutor, username, password);
    expect(result?.user.fullName).toBeTruthy();
  });
});
