import { ServerResponse } from 'http';
import {
  addUserToDb,
  getUserFromDb,
  getUsersFromDb,
  updateUserInDb,
} from '../db/db';
import { errorHandler, userNotFound } from '../utils/error-handler';
import { User } from '../models/user';

async function getUsers(res: ServerResponse): Promise<void> {
  try {
    const users = await getUsersFromDb();

    res.writeHead(200, { 'Content-type': 'application/json' });
    res.end(JSON.stringify(users));
  } catch (error) {
    errorHandler(res);
  }
}

async function getUserById(res: ServerResponse, id: string): Promise<void> {
  try {
    const user = await getUserFromDb(id);

    if (!user) {
      userNotFound(res);
    } else {
      res.writeHead(200, { 'Content-type': 'application/json' });
      res.end(JSON.stringify(user));
    }
  } catch (error) {
    errorHandler(res);
  }
}

async function createUser(res: ServerResponse, user: User): Promise<void> {
  try {
    const userFromDb = await addUserToDb(user);

    res.writeHead(200, { 'Content-type': 'application/json' });
    res.end(JSON.stringify(userFromDb));
  } catch (error) {
    errorHandler(res);
  }
}

async function updateUser(res: ServerResponse, user: User, id: string): Promise<void> {
  try {
    const updatedUser = await updateUserInDb(user, id);

    if (!updatedUser) {
      userNotFound(res);
    } else {
      res.writeHead(200, { 'Content-type': 'application/json' });
      res.end(JSON.stringify(updatedUser));
    }
  } catch (error) {
    errorHandler(res);
  }
}

export {
  getUsers,
  getUserById,
  createUser,
  updateUser,
};
