import express, { NextFunction, Response, Request } from 'express';
import 'express-async-errors';

import AppErrors from './errors/AppErrors';
import HttpErrors from './routes/errors/httpErrors';

import multerConfigs from './configs/multer';

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

/**
 * TODO: app.use(cors());
 */
app.use(express.json());
app.use('/img', express.static(multerConfigs.directory));
app.use(routes);

app.use(
  (error: Error, request: Request, response: Response, _: NextFunction) => {
    if (error instanceof AppErrors) {
      return response
        .status(HttpErrors[error.type])
        .json({ message: error.message });
    }

    return response.status(500).json({ message: error.message });
  },
);

export default app;
