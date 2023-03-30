const shopModel = require('../models/shop.model');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const RoleShop = {
  SHOP: 'SHOP',
  WRITER: '54345', // this is a fake role writer
  EDITOR: '76534', // this is a fake role editor
  ADMIN: '57407', // this is a fake role admin
};

class AccessService {
  static signUp = async ({ name, email, password }) => {
    try {
      // step 1: check email exist

      const holderShop = await shopModel.findOne({ email }).lean();
      if (holderShop) {
        return {
          code: '40001',
          message: 'Email already exist',
          status: 'error',
        };
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
        });

        console.log('privateKey', privateKey);
        console.log('publicKey', publicKey);
      }
      return {
        code: '20001',
        message: 'Sign up successfully',
        status: 'success',
      };
    } catch (error) {
      return {
        code: '50001',
        message: error.message,
        status: 'error',
      };
    }
  };
}

module.exports = AccessService;
