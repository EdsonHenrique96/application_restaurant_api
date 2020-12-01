import {
  Router, Request, Response,
} from 'express';

import { mysqlClient } from '../modules/mysql';

import RestaurantRepository from '../repositories/RestaurantRespository';
import CreateRestaurantService from '../services/CreateRestaurantService';
import GetRestaurantService from '../services/GetRestaurantService';

const restaurantRoutes = Router();

const restaurantRespository = new RestaurantRepository(mysqlClient);
const createRestaurantService = new CreateRestaurantService(restaurantRespository);
const getRestaurantService = new GetRestaurantService(restaurantRespository);

restaurantRoutes.get('/restaurant/:id', async (req: Request, res: Response) => {
  const { id: restaurantId } = req.params;

  const restaurants = await getRestaurantService.execute(restaurantId?.toString());

  return res.json(restaurants);
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
