import {
  Router, Request, Response,
} from 'express';

import { mysqlClient } from '../modules/mysql';

import RestaurantRepository from '../repositories/RestaurantRespository';
import CreateRestaurantService from '../services/CreateRestaurantService';
import GetRestaurantService from '../services/GetRestaurantService';
import DeleteRestaurantService from '../services/DeleteRestaurantService';

const restaurantRoutes = Router();

const restaurantRespository = new RestaurantRepository(mysqlClient);
const createRestaurantService = new CreateRestaurantService(restaurantRespository);
const getRestaurantService = new GetRestaurantService(restaurantRespository);
const deleteRestaurantService = new DeleteRestaurantService(restaurantRespository);

restaurantRoutes.get('/restaurant/:id', async (req: Request, res: Response) => {
  const { id: restaurantId } = req.params;

  const restaurants = await getRestaurantService.execute(restaurantId?.toString());

  return res.json(restaurants);
});

restaurantRoutes.get('/restaurant', async (req: Request, res: Response) => {
  const restaurants = await getRestaurantService.execute();

  return res.json(restaurants);
});

restaurantRoutes.post('/restaurant', async (req: Request, res: Response) => {
  const {
    photoUri,
    name,
    address,
    businessHours,
  } = req.body;

  const restaurantId = await createRestaurantService
    .execute({
      photoUri, name, address, businessHours,
    });

  return res.status(201).json({ id: restaurantId });
});

restaurantRoutes.delete('/restaurant/:id', async (req: Request, res: Response) => {
  const { id: restaurantId } = req.params;
  const restaurantIdDeleted = await deleteRestaurantService.execute(restaurantId);

  return res.json({ id: restaurantIdDeleted });
});

export default restaurantRoutes;
