import { expect, test } from 'vitest';
import { echo } from '../src/lib/echo.fn';
import { queryExecutor } from './query-executor';
test('Test echo', async () => {
  const msg = 'Hola Mundo!';
  const result = await echo(queryExecutor, msg);
  expect(msg).toEqual(result);
});
