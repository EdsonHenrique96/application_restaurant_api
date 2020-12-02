import { agent as request } from 'supertest';
import { Express } from 'express';
import { v4 as uuidV4 } from 'uuid';

import { mysqlClient } from '../../src/app/modules/mysql';
import setupApp from '../../src/app';

import { Restaurant } from '../../src/app/repositories/RestaurantRespository';

const fakeId = 'c806906d-9db4-4f33-99d1-847ff50c5287';
const photoUri = './anywhere/any.png';

const restaurantMock = {
  name: 'Boteco Triade',
  address: 'Av Paulista, 46',
  businessHours: 'das 7h ás 23h',
};

const clearDB = async () => {
  await mysqlClient
    .runQuery({ sqlQuery: 'DELETE FROM restaurant' });
};

const createManyRestaurants = async (numberOfRecords: number): Promise<string[]> => {
  const { name, address, businessHours } = restaurantMock;
  const recordIdCreated = [];

  for (let i = 1; i <= numberOfRecords; i+=1) {
    const id = uuidV4();

    await mysqlClient.runQuery({
      sqlQuery: 'INSERT INTO restaurant (id, photo, name, address, businessHours) VALUES (?, ?, ?, ?, ?)',
      placeholderValues: [id, photoUri, name, address, businessHours],
    });

    recordIdCreated.push(id);
  }

  return recordIdCreated;
};

describe('Route /restaurants', () => {
  describe('POST /restaurants', () => {
    let app: Express;

    beforeAll(async () => {
      app = await setupApp();
    });

    afterAll(async () => {
      await clearDB();
      await mysqlClient.closePoolConnections();
    });

    afterEach(async () => {
      await clearDB();
    });

    it.todo('Should be able to store the image when the compo field is sent');

    it('Should be able to create a restaurant', async () => request(app)
      .post('/restaurants')
      .set('Content-Type', 'multipart/form-data')
      .field('data', JSON.stringify(restaurantMock))
      .field('photo', photoUri)
      .expect(201)
      .then(async (response) => {
        expect(response.body).toHaveProperty('id');
        const restaurantId = response.body.id;

        const record: Array<Restaurant> = await mysqlClient.runQuery({
          sqlQuery: 'SELECT * FROM restaurant WHERE id=?',
          placeholderValues: [restaurantId],
        });

        expect(record[0].id).toEqual(restaurantId);
      }));

    it('Should be able to create a restaurant, when the photo field is not sent', async () => request(app)
      .post('/restaurants')
      .set('Content-Type', 'multipart/form-data')
      .field('data', JSON.stringify(restaurantMock))
      .expect(201)
      .then(async (response) => {
        expect(response.body).toHaveProperty('id');
        const restaurantId = response.body.id;

        const record: Array<Restaurant> = await mysqlClient.runQuery({
          sqlQuery: 'SELECT * FROM restaurant WHERE id=?',
          placeholderValues: [restaurantId],
        });

        expect(record[0].id).toEqual(restaurantId);
        expect(record[0].name).toEqual(restaurantMock.name);
        expect(record[0].address).toEqual(restaurantMock.address);
        expect(record[0].businessHours).toEqual(restaurantMock.businessHours);
      }));

    it('Should return 422, when the data field is not sent', async () => request(app)
      .post('/restaurants')
      .set('Content-Type', 'multipart/form-data')
      .field('photo', photoUri)
      .expect(422)
      .then(async (response) => {
        expect(response.body.message).toEqual('data field is mandatory');

        const record: Array<Restaurant> = await mysqlClient.runQuery({
          sqlQuery: 'SELECT * FROM restaurant WHERE name=?',
          placeholderValues: [restaurantMock.name],
        });

        expect(record.length).toEqual(0);
      }));
  });

  describe('GET /restaurants', () => {
    let app: Express;
    beforeAll(async () => {
      app = await setupApp();
    });

    afterAll(async () => {
      await clearDB();
      await mysqlClient.closePoolConnections();
    });

    afterEach(async () => {
      await clearDB();
    });

    it('Should return a specific restaurant, when the id is passed as query param', async () => {
      const { name, address, businessHours } = restaurantMock;
      await mysqlClient.runQuery({
        sqlQuery: 'INSERT INTO restaurant (id, photo, name, address, businessHours) VALUES (?, ?, ?, ?, ?)',
        placeholderValues: [fakeId, photoUri, name, address, businessHours],
      });

      return request(app)
        .get(`/restaurants/${fakeId}`)
        .send()
        .expect(200)
        .then((response) => {
          expect(response.body.length).toEqual(1);
          expect(response.body[0].id).toEqual(fakeId);
        });
    });

    it('Should return all restaurants, when the id is does not sent as query param', async () => {
      const numberOfRecords = 3;
      const recordsCreated = await createManyRestaurants(numberOfRecords);

      return request(app)
        .get('/restaurants')
        .send()
        .expect(200)
        .then((response) => {
          expect(response.body.length).toEqual(numberOfRecords);

          response.body.forEach((record: Restaurant) => {
            if (recordsCreated.indexOf(record.id) === -1) {
              throw new Error('Test error: inconsistent ids');
            }
          })
        });
    });

    it('Should return 400, when a non-existent id is passed', async () => {
      const { name, address, businessHours } = restaurantMock;
      await mysqlClient.runQuery({
        sqlQuery: 'INSERT INTO restaurant (id, photo, name, address, businessHours) VALUES (?, ?, ?, ?, ?)',
        placeholderValues: [fakeId, photoUri, name, address, businessHours],
      });

      return request(app)
        .get('/restaurants/xptoid13')
        .send()
        .expect(400)
        .then((response) => {
          expect(response.body.message).toEqual('Restaurant does not exist');
        });
    });
  });

  describe('PATCH /restaurants', () => {
    let app: Express;
    beforeAll(async () => {
      app = await setupApp();
    });

    afterAll(async () => {
      await clearDB();
      await mysqlClient.closePoolConnections();
    });

    afterEach(async () => {
      await clearDB();
    });

    it('Should be able to update the restaurant name', async () => {
      const { name, address, businessHours } = restaurantMock;
      const newName = 'Barzinho de narnia';

      await mysqlClient.runQuery({
        sqlQuery: 'INSERT INTO restaurant (id, photo, name, address, businessHours) VALUES (?, ?, ?, ?, ?)',
        placeholderValues: [fakeId, photoUri, name, address, businessHours],
      });

      return request(app)
        .patch(`/restaurants/${fakeId}`)
        .send({ name: newName })
        .expect(200)
        .then((response) => {
          const {
            id: recordId,
            name: recordName,
            address: recordAdress,
            businessHours: recordBusinessHours
          } = response.body;

          expect(recordId).toEqual(fakeId);
          expect(recordName).toEqual(newName);
          expect(recordAdress).toEqual(address);
          expect(recordBusinessHours).toEqual(businessHours);
        });
    });

    it('Should be able to update the restaurant address', async () => {
      const { name, address, businessHours } = restaurantMock;
      const newAddress = 'Rua Agusta, 20';

      await mysqlClient.runQuery({
        sqlQuery: 'INSERT INTO restaurant (id, photo, name, address, businessHours) VALUES (?, ?, ?, ?, ?)',
        placeholderValues: [fakeId, photoUri, name, address, businessHours],
      });

      return request(app)
        .patch(`/restaurants/${fakeId}`)
        .send({ address: newAddress })
        .expect(200)
        .then((response) => {
          const {
            id: recordId,
            name: recordName,
            address: recordAdress,
            businessHours: recordBusinessHours
          } = response.body;

          expect(recordId).toEqual(fakeId);
          expect(recordName).toEqual(name);
          expect(recordAdress).toEqual(newAddress);
          expect(recordBusinessHours).toEqual(businessHours);
        });
    });

    it('Should be able to update the restaurant businessHours', async () => {
      const { name, address, businessHours } = restaurantMock;
      const newBusinessHours = 'das 9h ás 9:30';

      await mysqlClient.runQuery({
        sqlQuery: 'INSERT INTO restaurant (id, photo, name, address, businessHours) VALUES (?, ?, ?, ?, ?)',
        placeholderValues: [fakeId, photoUri, name, address, businessHours],
      });

      return request(app)
        .patch(`/restaurants/${fakeId}`)
        .send({ businessHours: newBusinessHours })
        .expect(200)
        .then((response) => {
          const {
            id: recordId,
            name: recordName,
            address: recordAdress,
            businessHours: recordBusinessHours
          } = response.body;

          expect(recordId).toEqual(fakeId);
          expect(recordName).toEqual(name);
          expect(recordAdress).toEqual(address);
          expect(recordBusinessHours).toEqual(newBusinessHours);
        });
    });

    it('Should return 404, if id does not sent', async () => {
      const { name, address, businessHours } = restaurantMock;
      const newBusinessHours = 'das 9h ás 9:30';

      await mysqlClient.runQuery({
        sqlQuery: 'INSERT INTO restaurant (id, photo, name, address, businessHours) VALUES (?, ?, ?, ?, ?)',
        placeholderValues: [fakeId, photoUri, name, address, businessHours],
      });

      return request(app)
        .patch('/restaurants')
        .send({ businessHours: newBusinessHours })
        .expect(404);
    });
  });

  describe('DELETE /restaurants', () => {
    // TODO
  });
});
