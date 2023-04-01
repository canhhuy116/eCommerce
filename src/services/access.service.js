const shopModel = require('../models/shop.model');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const keyTokenModel = require('../models/keyToken.model');
const KeyTokenService = require('./keyToken.service');
const { createTokenPair } = require('../auth/authUtils');
const { getInfoData } = require('../utils');
const { BadRequestError } = require('../core/error.response');

const RoleShop = {
  SHOP: 'SHOP',
  WRITER: '54345', // this is a fake role writer
  EDITOR: '76534', // this is a fake role editor
  ADMIN: '57407', // this is a fake role admin
};

class AccessService {
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
      const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
        modulusLength: 4096,
        publicKeyEncoding: {
          type: 'pkcs1',
          format: 'pem',
        },
        privateKeyEncoding: {
          type: 'pkcs1',
          format: 'pem',
        },
      });

      console.log('privateKey', privateKey);
      console.log('publicKey', publicKey);

      const publicKeyString = await KeyTokenService.createKeyToken({
        userId: newShop._id,
        publicKey,
      });

      if (!publicKeyString) {
        return {
          code: '50001',
          message: 'publicKeyString error',
          status: 'error',
        };
      }

      const publicKeyObject = crypto.createPublicKey(publicKeyString);

      console.log('publicKeyObject', publicKeyObject);

      const tokens = await createTokenPair(
        { userId: newShop._id, roles: newShop.roles },
        publicKeyObject,
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
