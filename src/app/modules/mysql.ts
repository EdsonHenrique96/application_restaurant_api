import * as mysql from 'mysql';

interface mysqlSetupConnection {
  host: string;
  database?: string;
  user: string;
  password: string;
  maxNumOfConnections: number;
  connectTimeoutInMs: number;
  defaultQueryTimeoutInMs: number;
}

class MysqlClient {
  host?: string;

  database?: string;

  user?: string;

  maxNumOfConnections?: number;

  connectTimeoutInMs?: number;

  defaultQueryTimeoutInMs?: number;

  private driver?: mysql.Pool;

  setupConnectionPool({
    host,
    database,
    user,
    password,
    maxNumOfConnections,
    connectTimeoutInMs,
    defaultQueryTimeoutInMs,
  }: mysqlSetupConnection): Promise<void> {
    if (this.driver) {
      console.warn('Connections pool already set up!');
      return Promise.resolve();
    }

    console.info('Setting up connections pool...');

    this.host = host;
    this.database = database;
    this.user = user;
    this.maxNumOfConnections = maxNumOfConnections;
    this.connectTimeoutInMs = connectTimeoutInMs;
    this.defaultQueryTimeoutInMs = defaultQueryTimeoutInMs;

    let connectionPool: mysql.Pool;

    try {
      connectionPool = mysql.createPool({
        host,
        database,
        user,
        password,
        connectionLimit: maxNumOfConnections,
        connectTimeout: connectTimeoutInMs,
        acquireTimeout: connectTimeoutInMs,
        supportBigNumbers: true,
        dateStrings: true,
      });
    } catch (error) {
      error.message = `Failure creating connection pool: ${error.message}`;
      return Promise.reject(error);
    }

    connectionPool.on('error', (error: mysql.MysqlError) => {
      console.error(error);
    });

    this.driver = connectionPool;

    console.info('connection pool configuration was successful');
    return this.runQuery({ sqlQuery: 'SELECT 1' });
  }

  runQuery<T>({
    sqlQuery,
    placeholderValues = [],
    timeoutsInMs = this.defaultQueryTimeoutInMs,
  }: {
    sqlQuery: string;
    placeholderValues?: Array<string> | number | boolean;
    timeoutsInMs?: number;
  }): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      if (!this.driver) {
        reject(new Error('MysqlClient not started'));
      }

      return this.driver?.query({
        sql: sqlQuery,
        values: placeholderValues,
        timeout: timeoutsInMs,
      }, (error: mysql.MysqlError | null, results: T) => {
        if (error) {
          reject(
            console.error(error),
          );

          return;
        }

        resolve(results);
      });
    });
  }

  closePoolConnections(): Promise<void> {
    console.info('Closing connections pool');

    return new Promise<void>((resolve, reject) => {
      if (!this.driver) {
        console.warn('Cannot close connections: no connection pool set up');

        resolve();
        return;
      }

      this.driver.end((error: mysql.MysqlError | null) => {
        if (error) {
          reject(
            console.error(error),
          );

          return;
        }

        resolve();
      });

      delete this.driver;
    });
  }
}

const mysqlClient = new MysqlClient();

export {
  mysqlClient, /* this is a instance of MysqlClient */
  MysqlClient, /* this must be used as type */
};
