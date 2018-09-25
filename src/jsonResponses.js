// List of users
const users = {};

const respond = (request, response, status, object) => {
  const headers = {
    'Content-Type': 'application/json',
  };

  response.writeHead(status, headers);
  response.write(JSON.stringify(object));
  response.end();
};

const respondMeta = (request, response, status) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.end();
};

const getUsers = (request, response) => {
  // Sending back a list of users
  const responseJSON = {
    users,
  };

  // returning a 200
  respond(request, response, 200, responseJSON);
};

const getUsersMeta = (request, response) => {
  respondMeta(request, response, 200);
};

const addUser = (request, response, body) => {
  // Assume fail case
  const responseJSON = {
    message: 'Need name and age.',
  };

  // If either are missing send back a 400 error
  if (!body.name || !body.age) {
    responseJSON.id = 'missingParams';
    return respond(request, response, 400, responseJSON);
  }

  // Assume we have a successful creation
  let responseCode = 201;

  // If we already have that user...
  if (users[body.name]) {
    // We're updating (204 code)
    responseCode = 204;
  } else {
    // Create a new user
    users[body.name] = {};
  }

  users[body.name].name = body.name;
  users[body.name].age = body.age;

  if (responseCode === 201) {
    responseJSON.message = 'Successfully created user.';
    return respond(request, response, responseCode, responseJSON);
  }

  // We can't send back data with a 204
  return respondMeta(request, response, responseCode);
};

const notFound = (request, response) => {
  // Creating and returning an error message
  const responseJSON = {
    message: 'The page you are looking for was not found.',
    id: 'notFound',
  };

  respond(request, response, 404, responseJSON);
};
const notFoundMeta = (request, response) => {
  // No error 4 u
  respond(request, response, 404);
};

module.exports = {
  getUsers,
  getUsersMeta,
  addUser,
  notFound,
  notFoundMeta,
};
