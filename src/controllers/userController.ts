import { IncomingMessage, ServerResponse } from 'http';
import { addUserToDb, getUserFromDb, getUsersFromDb } from '../db/db';
import { errorHandler } from '../consts/error-handler';
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
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'User Not Found' }));
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

export { getUsers, getUserById, createUser };
