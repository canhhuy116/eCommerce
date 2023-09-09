const express = require('express');
const productController = require('../../controllers/product.controller');
const asyncHandler = require('../../helpers/asyncHandler');
const { authentication } = require('../../auth/authUtils');

const router = express.Router();

// authentication
router.use(authentication);
router.post('', asyncHandler(productController.createProduct));
router.get('/drafts/all', asyncHandler(productController.getAllDraftForShop));
router.get('/published/all', asyncHandler(productController.getAllPublishedForShop));
router.put('/publish/:id', asyncHandler(productController.publishProductByShop));
router.put('/unpublish/:id', asyncHandler(productController.unPublishProductByShop));

module.exports = router;
