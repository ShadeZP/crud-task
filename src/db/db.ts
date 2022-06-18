import { uuid } from 'uuidv4';
import users from '../data/users';
import { User } from '../models/user';

function getUsersFromDb(): Promise<User[]> {
  return new Promise((resolve) => {
    resolve(users);
  });
}

function getUserFromDb(id: string): Promise<User | undefined> {
  return new Promise((resolve) => {
    const user = users.find((u) => u.id === id);
    resolve(user);
  });
}

function addUserToDb(user: User): Promise<User> {
  return new Promise((resolve) => {
    const validUser: User = {
      ...user,
      id: uuid(),
    };
    users.push(validUser);
    resolve(validUser);
  });
}

function updateUserInDb(user: User, id: string): Promise<User | null> {
  return new Promise((resolve) => {
    const userIndex = users.findIndex((u) => u.id === id);

    if (userIndex === -1) {
      resolve(null);
    }

    users[userIndex] = {
      ...users[userIndex],
      ...user,
    };
    resolve(users[userIndex]);
  });
}

export {
  getUsersFromDb, getUserFromDb, addUserToDb, updateUserInDb,
};
