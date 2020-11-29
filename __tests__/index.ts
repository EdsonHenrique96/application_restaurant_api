import { agent } from 'supertest';

import app from '../src/app';

describe('GET /restaurants', () => {
  it('get all restaurants', () => {
    return agent(app)
      .get('/restaurants')
      .expect(200)
      .then((response) => {
        expect(response.body.message).toEqual('All restaurants');
      });
  });
});