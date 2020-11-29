import { Router, Request, Response } from 'express';

const restaurantRoutes = Router();

restaurantRoutes.get('/restaurants', (_req: Request, res: Response) => {
  res.json({ message: 'All restaurants' });
});

export default restaurantRoutes;
