import { createQueryExecutor } from 'graphql-client-utilities';

export const API_URL = 'http://localhost:8080/api';
export const queryExecutor = createQueryExecutor(API_URL);
