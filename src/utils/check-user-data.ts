import { User } from '../models/user';

function checkUserData(user: User): boolean {
  const { username, age, hobbies } = user;

  return typeof (username) === 'string'
      && typeof (age) === 'number'
      && Array.isArray(hobbies);
}

export default checkUserData;
