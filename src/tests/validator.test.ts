// eslint-disable-next-line import/no-extraneous-dependencies
import request from 'supertest';
import server from '../index';
import Url from '../consts/url';

const badMockUser = {
  username: 'mock',
  age: 1,
};

const badUUID: string = '9a9bc960-4838-4d80-bb2a-f2cb51e40b0z';

describe('User validation suit', () => {
  afterAll(() => {
    server.close();
  });

  describe('create user with incorrect body', () => {
    test('should return 400 error', async () => {
      const response = await request(server)
        .post(Url.users)
        .send(badMockUser);

      expect(response.statusCode).toEqual(400);
      expect(response.body).toEqual({ message: 'Invalid Data In Request' });
    });
  });

  describe('get user with incorrect id', () => {
    test('should return 400 error', async () => {
      const response = await request(server)
        .get(`${Url.users}/${badUUID}`);

      expect(response.statusCode).toEqual(400);
      expect(response.body).toEqual({ message: 'Invalid Id In Request' });
    });
  });

  describe('update user with incorrect id', () => {
    test('should return 400 error', async () => {
      const response = await request(server)
        .put(`${Url.users}/${badUUID}`)
        .send({ username: 123 });

      expect(response.statusCode).toEqual(400);
      expect(response.body).toEqual({ message: 'Invalid Id In Request' });
    });
  });

  describe('delete user with incorrect id', () => {
    test('should delete user and return 404 error', async () => {
      const response = await request(server)
        .del(`${Url.users}/${badUUID}`);

      expect(response.statusCode).toEqual(400);
      expect(response.body).toEqual({ message: 'Invalid Id In Request' });
    });
  });
});
