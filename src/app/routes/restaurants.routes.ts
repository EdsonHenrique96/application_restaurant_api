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
import AppError from '../errors/AppErrors';
import AppErrorTypes from '../errors/types/AppErrorTypes';

const restaurantRoutes = Router();

const restaurantRespository = new RestaurantRepository(mysqlClient);
const createRestaurantService = new CreateRestaurantService(restaurantRespository);
const getRestaurantService = new GetRestaurantService(restaurantRespository);
const deleteRestaurantService = new DeleteRestaurantService(restaurantRespository);
const updateRestaurantService = new UpdateRestaurantService(restaurantRespository);

const multer = Multer(multerConfigs);

restaurantRoutes.get('/restaurants/:id', async (req: Request, res: Response) => {
  const { id: restaurantId } = req.params;

  const restaurants = await getRestaurantService.execute(restaurantId?.toString());

  return res.json(restaurants);
});

restaurantRoutes.get('/restaurants', async (req: Request, res: Response) => {
  const restaurant = await getRestaurantService.execute();

  return res.json(restaurant);
});

restaurantRoutes.post('/restaurants',  async (req: Request, res: Response) => {
    const {
      name,
      address,
      businessHours,
    } = req.body;

    if(!name || !address || !businessHours) {
      throw new AppError({
        message: 'name, address and businessHours is mandatory',
        type: AppErrorTypes.MANDATORY_FIELD_NOT_SENT,
      });
    }

    const restaurantId = await createRestaurantService.execute({
        name,
        address,
        businessHours,
      });

    return res.status(201).json({ id: restaurantId });
  },
);

restaurantRoutes.delete('/restaurants/:id', async (req: Request, res: Response) => {
  const { id: restaurantId } = req.params;

  if(!restaurantId) {
    throw new AppError({
      message: 'id is mandatory',
      type: AppErrorTypes.MANDATORY_FIELD_NOT_SENT,
    });
  }

  const restaurantIdDeleted = await deleteRestaurantService.execute(restaurantId);

  return res.json({ id: restaurantIdDeleted });
});

restaurantRoutes.patch(
  '/restaurants/:id',
  async (req: Request, res: Response) => {
  const {
    photo, name, address, businessHours,
  } = req.body;
  const { id } = req.params;

  if(!id) {
    throw new AppError({
      message: 'id is mandatory',
      type: AppErrorTypes.MANDATORY_FIELD_NOT_SENT,
    });
  }

  const restaurantUpdated = await updateRestaurantService.execute({
    restaurantId: id, photoUri: photo, name, address, businessHours,
  });

  return res.json(restaurantUpdated);
});

restaurantRoutes.patch('/restaurant/:id/avatar', multer.single('photo'),
  async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!req.file) {
    throw new AppError({
      message: 'photo is mandatory',
      type: AppErrorTypes.MANDATORY_FIELD_NOT_SENT,
    });
  }

  const restaurantUpdated = await updateRestaurantService.execute({
    restaurantId: id, photoUri: req.file.filename
  });

  return res.json(restaurantUpdated);
})

export default restaurantRoutes;
