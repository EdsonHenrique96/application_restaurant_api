import express from 'express';

import routes from './routes';

const app = express();

// use cors
app.use(routes);

export default app;
