import { Router } from 'express';

import restaurantRoutes from './restaurants.routes';

const routes = Router();

routes.use(restaurantRoutes);

export default routes;
