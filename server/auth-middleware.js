const jwt = require('jsonwebtoken');
const ClientError = require('./client-error');

function authMiddleware(req, res, next) {
  const token = req.header('Authorization');
  if (!token) {
    throw new ClientError(400, 'A token is required to authenticate');
  }
  try {
    const payload = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = payload;
  } catch (err) {
    throw new ClientError(401, 'Invalid Token');
  }
  next();
}

module.exports = authMiddleware;
