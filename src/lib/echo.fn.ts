import { QueryExecutor, gqlparse } from 'graphql-client-utilities';

export const echo = (executor: QueryExecutor, msg: string): Promise<string> => {
  const query = gqlparse`
    query QueryEcho($msg:String!) {
        echo(message:$msg)
    }
  `;
  return executor<{ echo: string }>(query, { msg }).then((result) => result.data.echo);
};
