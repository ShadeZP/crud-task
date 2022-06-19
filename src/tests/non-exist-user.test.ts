// eslint-disable-next-line import/no-extraneous-dependencies
import request from 'supertest';
import server from '../index';
import Url from '../consts/url';

const nonExistUUID: string = '9a9bc960-4838-4d80-bb2a-f2cb51e40b0a';

describe('User initial suit', () => {
  describe('initial return no user', () => {
    test('status should be equal 200', async () => {
      const response = await request(server)
        .get(Url.users);

      expect(response.statusCode).toEqual(200);
      expect(response.body).toEqual([]);
    });
  });

  describe('get non-exist user by id', () => {
    test('should return 404 error', async () => {
      const response = await request(server)
        .get(`${Url.users}/${nonExistUUID}`);

      expect(response.statusCode).toEqual(404);
      expect(response.body).toEqual({ message: 'User Not Found' });
    });
  });

  describe('update non-exist user', () => {
    test('should return 404 error', async () => {
      const response = await request(server)
        .put(`${Url.users}/${nonExistUUID}`)
        .send({ username: 'hello' });

      expect(response.statusCode).toEqual(404);
      expect(response.body).toEqual({ message: 'User Not Found' });
    });
  });

  describe('delete non-exist user', () => {
    test('should return 404 error', async () => {
      const response = await request(server)
        .del(`${Url.users}/${nonExistUUID}`);

      expect(response.statusCode).toEqual(404);
      expect(response.body).toEqual({ message: 'User Not Found' });
    });
  });
});
