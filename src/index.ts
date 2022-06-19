import 'dotenv/config';
import { createServer } from 'http';
import cluster from 'cluster';
import os from 'os';
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
  if (cluster.isWorker) {
    console.log(`Worker ${cluster.worker.id} handle request`);
  }
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
  if (process.argv[2] === '--multi') {
    if (cluster.isPrimary) {
      const cpus = os.cpus().length;

      for (let i = 0; i < cpus; i += 1) cluster.fork();

      cluster.on('exit', (worker, code) => {
        console.log(
          `Worker ${worker.id} finished. Exit code: ${code}`,
        );

        server.listen(port, () => console.log(`Worker ${cluster.worker.id} launched`));
      });
    } else {
      server.listen(port, () => console.log(`Worker ${cluster.worker.id} launched`));
    }
  } else {
    server.listen(port, () => console.log(`Server is running on port ${port}`));
  }
}

export default server;
