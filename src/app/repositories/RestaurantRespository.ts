import { v4 as uuidV4 } from 'uuid';
import { MysqlClient } from '../modules/mysql';

import AppError from '../errors/AppErrors';
import AppErrorTypes from '../errors/types/AppErrorTypes';

interface Restaurant {
  photo: string;
  name: string;
  address: string;
  businessHours: string;
}

/**
 * FIXME: O client deve ser genérico, para a solução não ficar amarrada
 * a um client especifico.
 */
class RestaurantRepository {
  private client: MysqlClient;

  constructor(client: MysqlClient) {
    this.client = client;
  }

  async create({
    photoUri,
    name,
    address,
    businessHours,
  }: {
    photoUri: string;
    name: string;
    address: string;
    businessHours: string;
  }): Promise<string> {
    const restaurantId = uuidV4();

    const sqlQuery = 'INSERT INTO restaurant (id, photo, name, address, business_hours) VALUES (?, ?, ?, ?, ?)';
    try {
      const result: { affectedRows: number } = await this.client
        .runQuery({
          sqlQuery,
          placeholderValues: [restaurantId, photoUri, name, address, businessHours],
        });

      if (result.affectedRows === 1) return restaurantId;
      throw new AppError({
        message: 'Unexpected case: INSERT succeeded, but 0 rows were affected',
        type: AppErrorTypes.INTERNAL_ERROR,
      });
    } catch (error) {
      console.error(`repository/restaurant::create: ${error.message}`);
      throw error;
    }
  }
}

export default RestaurantRepository;
