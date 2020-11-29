import { Router } from 'express';

import restaurantRoutes from './restaurant.routes';

const routes = Router();

routes.use(restaurantRoutes);

export default routes;
