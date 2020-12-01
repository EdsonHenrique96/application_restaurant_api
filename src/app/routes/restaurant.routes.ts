import {
  Router, Request, Response,
} from 'express';

import { mysqlClient } from '../modules/mysql';

import CreateRestaurantService from '../services/CreateRestaurantService';
import RestaurantRepository from '../repositories/RestaurantRespository';

const restaurantRoutes = Router();

const restaurantRespository = new RestaurantRepository(mysqlClient);
const createRestaurantService = new CreateRestaurantService(restaurantRespository);

restaurantRoutes.get('/restaurant', (_req: Request, res: Response) => {
  res.json({ message: 'All restaurants' });
});

restaurantRoutes.post('/restaurant', async (req: Request, res: Response) => {
  const {
    photoUri,
    name,
    address,
    businessHours,
  } = req.body;

  try {
    const restaurantId = await createRestaurantService
      .execute({
        photoUri, name, address, businessHours,
      });

    return res.status(201).json({ id: restaurantId });
  } catch (error) {
    return res.status(500);
  }
});

export default restaurantRoutes;
