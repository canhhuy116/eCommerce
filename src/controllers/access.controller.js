const { Created } = require('../core/success.response');
const AccessService = require('../services/access.service');

class AccessController {
  signUp = async (req, res, next) => {
    new Created({
      message: 'User created successfully',
      metadata: await AccessService.signUp(req.body),
      options: {
        location: `${req.protocol}://${req.get('host')}/api/v1/access/sign-in`,
      },
    }).send(res);
  };
}

module.exports = new AccessController();
