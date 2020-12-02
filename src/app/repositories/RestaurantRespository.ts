import { v4 as uuidV4 } from 'uuid';
import { MysqlClient } from '../modules/mysql';

import AppError from '../errors/AppErrors';
import AppErrorTypes from '../errors/types/AppErrorTypes';

export interface Restaurant {
  id: string;
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

    const sqlQuery = 'INSERT INTO restaurant (id, photo, name, address, businessHours) VALUES (?, ?, ?, ?, ?)';
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
      console.debug(`repository/restaurant::create: ${error.message}`);
      throw error;
    }
  }

  async get(restaurantId?: string): Promise<Restaurant[]> {
    const sqlQuery = `SELECT * FROM restaurant ${restaurantId ? `WHERE id="${restaurantId}" LIMIT 1` : ''}`;
    try {
      const restaurants: Array<Restaurant> = await this.client
        .runQuery({ sqlQuery });

      if (restaurants.length >= 1) return restaurants;
      throw new AppError({
        message: 'Restaurant does not exist',
        type: AppErrorTypes.RECORD_NOT_EXISTS,
      });
    } catch (error) {
      console.debug(`repository/restaurant::get: ${error.message}`);
      throw error;
    }
  }

  async delete(restaurantId: string): Promise<string> {
    const sqlQuery = 'DELETE FROM restaurant WHERE id=?';

    try {
      const result: { affectedRows: number } = await this.client.runQuery({
        sqlQuery,
        placeholderValues: [restaurantId],
      });

      if (result.affectedRows === 1) return restaurantId;

      throw new AppError({
        message: 'Record to be deleted does not exist',
        type: AppErrorTypes.RECORD_NOT_EXISTS,
      });
    } catch (error) {
      console.debug(`repository/restaurant::delete: ${error.message}`);
      throw error;
    }
  }

  async update({
    restaurantId, photoUri, name, address, businessHours,
  }: {
    restaurantId: string;
    photoUri?: string;
    name?: string;
    address?: string;
    businessHours?:string
  }): Promise<Restaurant> {
    try {
      const restaurant = await this.get(restaurantId);

      if (!restaurant) {
        throw new AppError({
          message: 'Record to be updated does not exist',
          type: AppErrorTypes.RECORD_NOT_EXISTS,
        });
      }

      /**
       * FIXME criar função para montar a entidade restaurant
       */
      const restaurantForUpdate = {
        id: restaurant[0].id,
        photo: photoUri || restaurant[0].photo,
        name: name || restaurant[0].name,
        address: address || restaurant[0].address,
        businessHours: businessHours || restaurant[0].businessHours,
      };

      const sqlQuery = 'UPDATE restaurant SET photo=?, name=?, address=?, businessHours=? WHERE id=?';
      await this.client.runQuery({
        sqlQuery,
        placeholderValues: [
          restaurantForUpdate.photo,
          restaurantForUpdate.name,
          restaurantForUpdate.address,
          restaurantForUpdate.businessHours,
          restaurantForUpdate.id,
        ],
      });

      return restaurantForUpdate;
    } catch (error) {
      console.debug(`repository/restaurant::update: ${error.message}`);
      throw error;
    }
  }
}

export default RestaurantRepository;
