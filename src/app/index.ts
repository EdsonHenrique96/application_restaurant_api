import express from 'express';

import routes from './routes';

import { mysqlClient as database } from './modules/mysql';

const app = express();

const {
  MYSQL_HOST,
  MYSQL_DATABASE,
  MYSQL_USER,
  MYSQL_PASSWORD,
  MYSQL_MAX_NUM_OF_CONNECTIONS,
  MYSQL_CONNECT_TIMEOUT_MS,
  MYSQL_DEFAULT_QUERY_TIMEOUT_MS,
} = process.env;

try {
  database.setupConnectionPool({
    host: MYSQL_HOST as string,
    database: MYSQL_DATABASE,
    user: MYSQL_USER as string,
    password: MYSQL_PASSWORD as string,
    maxNumOfConnections: MYSQL_MAX_NUM_OF_CONNECTIONS
      ? Number.parseInt(MYSQL_MAX_NUM_OF_CONNECTIONS, 10) : 8,
    connectTimeoutInMs: MYSQL_CONNECT_TIMEOUT_MS
      ? Number.parseInt(MYSQL_CONNECT_TIMEOUT_MS, 10) : 2000,
    defaultQueryTimeoutInMs: MYSQL_DEFAULT_QUERY_TIMEOUT_MS
      ? Number.parseInt(MYSQL_DEFAULT_QUERY_TIMEOUT_MS, 10) : 4000,
  });
} catch (error) {
  console.error(`Fatal error: ${error}`);
  process.exit(1);
}

// use cors
app.use(routes);

export default app;
