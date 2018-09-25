const http = require('http');
const url = require('url');
const query = require('querystring');
const htmlHandler = require('./htmlResponses.js');
const jsonHandler = require('./jsonResponses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const urlStruct = {
  '/': htmlHandler.getIndex,
  '/style.css': htmlHandler.getCSS,
  '/getUsers': jsonHandler.getUsers,
  '/addUser': jsonHandler.addUser,
};

const onRequest = (request, response) => {
  const parsedURL = url.parse(request.url);
  switch (request.method) {
    case 'POST':
      if (parsedURL.pathname === '/addUser') {
        const res = response;
        const body = [];

        request.on('error', (err) => {
          console.dir(err);
          res.statusCode = 400;
          res.end();
        });
        request.on('data', (chunk) => {
          body.push(chunk);
        });
        request.on('end', () => {
          const bodyString = Buffer.concat(body).toString();
          const bodyParams = query.parse(bodyString);


          jsonHandler.addUser(request, res, bodyParams);
        });
      } else {
        jsonHandler.notFound(request, response);
      }
      break;
    case 'GET':
      if (urlStruct[parsedURL.pathname]) {
        urlStruct[parsedURL.pathname](request, response);
      } else {
        jsonHandler.notFound(request, response);
      }
      break;
    case 'HEAD':
      if (urlStruct[parsedURL.pathname]) {
        urlStruct[parsedURL.pathname](request, response);
      } else {
        jsonHandler.notFoundMeta(request, response);
      }
      break;
    default:
      jsonHandler.notFound(request, response);
      break;
  }
};

http.createServer(onRequest).listen(port);

console.log(`Listening on 127.0.0.1: ${port}`);
