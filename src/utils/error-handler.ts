import { ServerResponse } from 'http';

function errorHandler(res:ServerResponse): void {
  res.writeHead(500, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ message: 'Something went wrong' }));
}
function badId(res:ServerResponse): void {
  res.writeHead(400, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ message: 'Invalid Id In Request' }));
}

function badRequest(res:ServerResponse): void {
  res.writeHead(400, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ message: 'Invalid Data In Request' }));
}

function userNotFound(res:ServerResponse): void {
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ message: 'User Not Found' }));
}

function routeNotFound(res: ServerResponse):void {
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ message: 'Route Not Found' }));
}

export {
  errorHandler,
  badRequest,
  userNotFound,
  routeNotFound,
  badId,
};
