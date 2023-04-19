const { Created, SuccessResponse } = require('../core/success.response');
const AccessService = require('../services/access.service');

class AccessController {
  handleRefreshToken = async (req, res, next) => {
    new SuccessResponse({
      message: 'Get token successfully',
      metadata: await AccessService.handleRefreshToken({
        keyStore: req.keyStore,
        user: req.user,
        refreshToken: req.refreshToken,
      }),
    }).send(res);
  };

  logout = async (req, res, next) => {
    new SuccessResponse({
      message: 'Logout successfully',
      metadata: await AccessService.logout(req.keyStore),
    }).send(res);
  };

  login = async (req, res, next) => {
    new SuccessResponse({
      metadata: await AccessService.signIn(req.body),
      message: 'Login successfully',
    }).send(res);
  };

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
