const JWT = require('jsonwebtoken');
const asyncHandler = require('../helpers/asyncHandler');
const { findByUserId } = require('../services/keyToken.service');
const { NotFoundError, BadRequestError } = require('../core/error.response');

const HEADER = {
  API_KEY: 'x-api-key',
  CLIENT_ID: 'x-client-id',
  AUTHORIZATION: 'authorization',
};

const createTokenPair = async (payload, publicKey, privateKey) => {
  try {
    const accessToken = await JWT.sign(payload, privateKey, {
      algorithm: 'RS256',
      expiresIn: '2 days',
    });

    const refreshToken = await JWT.sign(payload, privateKey, {
      algorithm: 'RS256',
      expiresIn: '7 days',
    });

    JWT.verify(accessToken, publicKey, (err, decoded) => {
      if (err) {
        console.error('err verify', err);
      }
      console.log('decoded', decoded);
    });

    return {
      accessToken,
      refreshToken,
    };
  } catch (error) {}
};

const authentication = asyncHandler(async (req, res, next) => {
  const userId = req.headers[HEADER.CLIENT_ID];
  if (!userId) {
    throw new BadRequestError('Missing client id');
  }

  const keyStore = await findByUserId(userId);
  if (!keyStore) {
    throw new NotFoundError('Key store not found');
  }

  const accessToken = req.headers[HEADER.AUTHORIZATION];
  console.log('accessToken', accessToken);
  if (!accessToken) {
    throw new BadRequestError('Missing access token');
  }

  try {
    const decodeUser = await JWT.verify(accessToken, keyStore.publicKey);
    if (userId !== decodeUser.userId) {
      throw new BadRequestError('Invalid access token');
    }

    req.keyStore = keyStore;
    return next();
  } catch (error) {
    throw error;
  }
});

module.exports = {
  createTokenPair,
  authentication,
};
