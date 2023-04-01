const { findById } = require('../services/apiKey.service');

const HEADER = {
  API_KEY: 'x-api-key',
  AUTHORIZATION: 'Authorization',
};

const apiKey = async (req, res, next) => {
  try {
    const key = req.headers[HEADER.API_KEY]?.toString();
    if (!key) {
      return res.status(403).json({
        message: 'Forbidden Error',
      });
    }
    // check objKey
    const objKey = await findById(key);
    if (!objKey) {
      return res.status(403).json({
        message: 'Forbidden Error',
      });
    }
    req.apiKey = objKey;
    return next();
  } catch (error) {}
};

const permission = (permission) => {
  return (req, res, next) => {
    const { apiKey } = req;
    if (!apiKey) {
      return res.status(403).json({
        message: 'permission denied',
      });
    }

    const validPermission = apiKey.permissions.includes(permission);
    if (!validPermission) {
      return res.status(403).json({
        message: 'permission denied',
      });
    }

    return next();
  };
};

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = { apiKey, permission, asyncHandler };
