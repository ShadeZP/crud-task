import 'dotenv/config';
import { createServer } from 'http';
import {
  createUser,
  deleteUser,
  getUserById,
  getUsers,
  updateUser,
} from './controllers/userController';
import uuidValidator from './utils/uuid-validator';
import Method from './consts/method';
import Url from './consts/url';
import checkUserData from './utils/check-user-data';
import getRequestBody from './utils/get-request-body';
import { User } from './models/user';
import {
  badId, badRequest, errorHandler, routeNotFound,
} from './utils/error-handler';

const server = createServer((req, res) => {
  const { url, method } = req;
  if (!url || !method) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Bad Request' }));
  } else if (url === Url.users && method === Method.Get) {
    getUsers(res);
  } else if (url.match(/\/api\/users\/.+/) && method === Method.Get) {
    const id: string = url.split('/')[3];
    const ifUuid: boolean = uuidValidator(id);
    if (!ifUuid) {
      badId(res);
    } else {
      getUserById(res, id);
    }
  } else if (url === Url.users && method === Method.Post) {
    getRequestBody(req)
      .then((data) => {
        const user: User = JSON.parse(data);
        const ifUserDataValid: boolean = checkUserData(user);

        if (!ifUserDataValid) {
          badRequest(res);
        } else {
          createUser(res, user);
        }
      })
      .catch(() => {
        errorHandler(res);
      });
  } else if (url.match(/\/api\/users\/.+/) && method === Method.Put) {
    getRequestBody(req)
      .then((data) => {
        const user: User = JSON.parse(data);
        const id: string = url.split('/')[3];
        const ifUuid: boolean = uuidValidator(id);
        if (!ifUuid) {
          badId(res);
        } else {
          updateUser(res, user, id);
        }
      })
      .catch(() => {
        errorHandler(res);
      });
  } else if (url.match(/\/api\/users\/.+/) && method === Method.Delete) {
    const id: string = url.split('/')[3];
    const ifUuid: boolean = uuidValidator(id);

    if (!ifUuid) {
      badId(res);
    } else {
      deleteUser(res, id);
    }
  } else {
    routeNotFound(res);
  }
});

const port = parseInt(process.env.PORT as string, 10) || 3000;

if (process.env.NODE_ENV !== 'test') {
  server.listen(port, () => console.log(`Server is running on port ${port}`));
}

export default server;
