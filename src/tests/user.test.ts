// eslint-disable-next-line import/no-extraneous-dependencies
import request from 'supertest';
import server from '../index';
import Url from '../consts/url';
import { User } from '../models/user';

const mockUser: User = {
  username: 'mock',
  age: 1,
  hobbies: [],
};

describe('User initial suit', () => {
  describe('initial return no user', () => {
    test('status should be equal 200', async () => {
      const response = await request(server)
        .get(Url.users);

      expect(response.statusCode).toEqual(200);
      expect(response.body).toEqual([]);
    });
  });

  describe('create user', () => {
    test('should return new user', async () => {
      const response = await request(server)
        .post(Url.users)
        .send(mockUser);

      expect(response.statusCode).toEqual(200);
      expect(response.body).toMatchObject<User>(mockUser);
    });
  });

  describe('get user by id', () => {
    test('should return user', async () => {
      const allUsers = await request(server)
        .get(Url.users);
      const user: User = allUsers.body[0];

      const response = await request(server)
        .get(`${Url.users}/${user.id}`);

      expect(response.statusCode).toEqual(200);
      expect(response.body).toEqual(user);
    });
  });

  describe('update user', () => {
    test('should return updated user', async () => {
      const allUsers = await request(server)
        .get(Url.users);
      const user: User = allUsers.body[0];

      const response = await request(server)
        .put(`${Url.users}/${user.id}`)
        .send({ username: 'hello' });

      expect(response.statusCode).toEqual(200);
      expect(response.body).toEqual({ ...user, username: 'hello' });
    });
  });

  describe('delete user', () => {
    test('should delete user and return 404 error', async () => {
      const allUsers = await request(server)
        .get(Url.users);
      const user: User = allUsers.body[0];

      const response = await request(server)
        .del(`${Url.users}/${user.id}`);

      expect(response.statusCode).toEqual(204);

      const res = await request(server)
        .get(`${Url.users}/${user.id}`);

      expect(res.statusCode).toEqual(404);
      expect(res.body).toEqual({ message: 'User Not Found' });
    });
  });
});
