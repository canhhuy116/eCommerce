const shopModel = require('../models/shop.model');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const keyTokenModel = require('../models/keyToken.model');
const KeyTokenService = require('./keyToken.service');
const { createTokenPair } = require('../auth/authUtils');
const { getInfoData } = require('../utils');
const { BadRequestError } = require('../core/error.response');
const { findByEmail } = require('./shop.service');
const { UnauthorizedError } = require('../core/error.response');

const RoleShop = {
  SHOP: 'SHOP',
  WRITER: '54345', // this is a fake role writer
  EDITOR: '76534', // this is a fake role editor
  ADMIN: '57407', // this is a fake role admin
};

class AccessService {
  static logout = async (keyStore) => {
    const delKey = await KeyTokenService.removeKeyById(keyStore._id);
    return delKey;
  };

  static signIn = async ({ email, password, refreshToken = null }) => {
    const foundShop = await findByEmail({ email });
    console.log('foundShop', foundShop);
    if (!foundShop) {
      throw new BadRequestError('Shop not found');
    }

    const match = await bcrypt.compare(password, foundShop.password);
    if (!match) {
      throw new UnauthorizedError('Password is incorrect');
    }

    const publicKey = crypto.randomBytes(256).toString('base64');
    const privateKey = crypto.randomBytes(256).toString('base64');

    const { _id: userId } = foundShop;

    const tokens = await createTokenPair(
      { userId, roles: foundShop.roles },
      publicKey,
      privateKey
    );

    const keyStore = await KeyTokenService.createKeyToken({
      userId,
      publicKey,
      privateKey,
      refreshToken: tokens.refreshToken,
    });

    console.log('keyStore', keyStore);

    return {
      shop: getInfoData(['_id', 'name', 'email', 'roles'], foundShop),
      tokens,
    };
  };

  static signUp = async ({ name, email, password }) => {
    // step 1: check email exist

    const holderShop = await shopModel.findOne({ email }).lean();
    if (holderShop) {
      throw new BadRequestError('Email already exists');
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const newShop = await shopModel.create({
      name,
      email,
      password: passwordHash,
      roles: [RoleShop.SHOP],
    });

    if (newShop) {
      // created privateKey, publicKey
      const publicKey = crypto.randomBytes(256).toString('base64');
      const privateKey = crypto.randomBytes(256).toString('base64');

      console.log('privateKey', privateKey);
      console.log('publicKey', publicKey);

      const keyStore = await KeyTokenService.createKeyToken({
        userId: newShop._id,
        publicKey,
        privateKey,
      });

      if (!keyStore) {
        return {
          code: '50001',
          message: 'keyStore error',
          status: 'error',
        };
      }

      const tokens = await createTokenPair(
        { userId: newShop._id, roles: newShop.roles },
        publicKey,
        privateKey
      );

      return {
        code: '20001',
        metadata: {
          shop: getInfoData(['_id', 'name', 'email', 'roles'], newShop),
          tokens,
        },
      };
    }

    return {
      code: '200',
      metadata: null,
    };
  };
}

module.exports = AccessService;
