import {
  Router, Request, Response,
} from 'express';
import Multer from 'multer';

import multerConfigs from '../configs/multer';

import { mysqlClient } from '../modules/mysql';

import RestaurantRepository from '../repositories/RestaurantRespository';
import CreateRestaurantService from '../services/CreateRestaurantService';
import GetRestaurantService from '../services/GetRestaurantService';
import DeleteRestaurantService from '../services/DeleteRestaurantService';
import UpdateRestaurantService from '../services/UpdateRestaurantService';

const restaurantRoutes = Router();

const restaurantRespository = new RestaurantRepository(mysqlClient);
const createRestaurantService = new CreateRestaurantService(restaurantRespository);
const getRestaurantService = new GetRestaurantService(restaurantRespository);
const deleteRestaurantService = new DeleteRestaurantService(restaurantRespository);
const updateRestaurantService = new UpdateRestaurantService(restaurantRespository);

const multer = Multer(multerConfigs);

restaurantRoutes.get('/restaurant/:id', async (req: Request, res: Response) => {
  const { id: restaurantId } = req.params;

  const restaurants = await getRestaurantService.execute(restaurantId?.toString());

  return res.json(restaurants);
});

restaurantRoutes.get('/restaurant', async (req: Request, res: Response) => {
  const restaurant = await getRestaurantService.execute();

  return res.json(restaurant);
});

restaurantRoutes.post(
  '/restaurant',
  multer.single('photo'),
  async (req: Request, res: Response) => {
    const {
      name,
      address,
      businessHours,
    } = JSON.parse(req.body.data);
    let photoUri = '';

    if (req.file) {
      photoUri = req.file.filename;
    }

    const restaurantId = await createRestaurantService
      .execute({
        photoUri, name, address, businessHours,
      });

    return res.status(201).json({ id: restaurantId });
  },
);

restaurantRoutes.delete('/restaurant/:id', async (req: Request, res: Response) => {
  const { id: restaurantId } = req.params;
  const restaurantIdDeleted = await deleteRestaurantService.execute(restaurantId);

  return res.json({ id: restaurantIdDeleted });
});

restaurantRoutes.patch('/restaurant/:id', async (req: Request, res: Response) => {
  const {
    photo, name, address, businessHours,
  } = req.body;
  const { id } = req.params;

  const restaurantUpdated = await updateRestaurantService.execute({
    restaurantId: id, photoUri: photo, name, address, businessHours,
  });

  return res.json(restaurantUpdated);
});

export default restaurantRoutes;
