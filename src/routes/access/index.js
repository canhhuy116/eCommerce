const express = require('express');
const accessController = require('../../controllers/access.controller');
const asyncHandler = require('../../helpers/asyncHandler');
const { authentication } = require('../../auth/authUtils');

const router = express.Router();

// signUp
router.post('/signup', asyncHandler(accessController.signUp));

// signIn
router.post('/login', asyncHandler(accessController.login));

// authentication
router.use(authentication);
router.post('/logout', asyncHandler(accessController.logout));
router.post('/handleRefreshToken', asyncHandler(accessController.handleRefreshToken));

module.exports = router;
