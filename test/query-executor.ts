import { createQueryExecutor } from 'graphql-client-utilities';

export const queryExecutor = createQueryExecutor('http://localhost:8080/api');
