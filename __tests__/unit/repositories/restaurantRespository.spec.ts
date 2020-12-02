import { mocked } from 'ts-jest/utils';

import { mysqlClient } from '../../../src/app/modules/mysql';
import RestaurantRespository, { Restaurant } from '../../../src/app/repositories/RestaurantRespository';


// workaround to make testing stout cleaner
console.info = jest.fn();
console.warn = jest.fn();
console.debug = jest.fn();
console.error = jest.fn();
console.log = jest.fn();

jest.mock('../../../src/app/modules/mysql');

const mysqlClientMocked = mocked(mysqlClient, true);

const listRestaurants: Array<Restaurant> = [
  {
    id: 'blablabla',
    photo: 'asasd/asd.png',
    name: 'Barzinho everyone null',
    address: 'nullx',
    businessHours: 'pra sempre',
  },
  {
    id: 'aaaaaa',
    photo: 'cccc/asd.png',
    name: 'Churrascaria X',
    address: 'nullx',
    businessHours: 'das 9h ás 15:30',
  },
  {
    id: 'bbbbb',
    photo: 'vvv/asd.png',
    name: 'Superman Lounge',
    address: 'nullx',
    businessHours: 'das 23h ás 6:30',
  }
];


describe('RestaurantRespository', () => {
  describe('RestaurantRespository::get', () => {
    it('Should return a list of restaurant, when the restaurantId is not passed', async () => {
      const restaurantRepository = new RestaurantRespository(mysqlClientMocked);

      mysqlClientMocked.runQuery
        .mockResolvedValue(Promise.resolve(listRestaurants));

      const result = await restaurantRepository.get();

      expect(mysqlClientMocked.runQuery)
        .toHaveBeenCalledWith({ sqlQuery: 'SELECT * FROM restaurant'});
      expect(result.length).toEqual(3);
    });

    it('Should return a specific restaurant, when a valid restaurantId is passed', async() => {
      const restaurantRepository = new RestaurantRespository(mysqlClientMocked);

      mysqlClientMocked.runQuery
        .mockResolvedValue(Promise.resolve([listRestaurants[0]]));

      const result = await restaurantRepository.get(listRestaurants[0].id);

      expect(mysqlClientMocked.runQuery)
        .toHaveBeenCalledWith({ sqlQuery: `SELECT * FROM restaurant WHERE id="${listRestaurants[0].id}" LIMIT 1`});
      expect(result.length).toEqual(1);
    });

    it('Should throw an exception, when an invalid restaurantId is passed', async() => {
      const restaurantRepository = new RestaurantRespository(mysqlClientMocked);

      mysqlClientMocked.runQuery
        .mockResolvedValue(Promise.resolve([]));

      try {
        await restaurantRepository.get('nonExistentId123');
        fail();
      } catch(err) {
        expect(mysqlClientMocked.runQuery)
        .toHaveBeenCalledWith({ sqlQuery: `SELECT * FROM restaurant WHERE id="nonExistentId123" LIMIT 1`});

        expect(err.message).toEqual('Restaurant does not exist');
      }
    });
  });

  describe('RestaurantRepository::delete', () => {
    it.todo('unit tests');
  });

  describe('RestaurantRepository::update', () => {
    it.todo('unit tests');
  });

  describe('RestaurantRepository::create', () => {
    it.todo('unit tests');
  });
});