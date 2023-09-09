const { SuccessResponse } = require('../core/success.response');
const ProductService = require('../services/product.service');

class ProductController {
  createProduct = async (req, res, next) => {
    new SuccessResponse({
      message: 'create Product successfully',
      metadata: await ProductService.createProduct(req.body.product_type, {
        ...req.body,
        product_shop: req.user.userId,
      }),
    }).send(res);
  };

  publishProductByShop = async (req, res, next) => {
    new SuccessResponse({
      message: 'publish Product successfully',
      metadata: await ProductService.publishProductByShop({ product_shop: req.user.userId, product_id: req.params.id }),
    }).send(res);
  };

  unPublishProductByShop = async (req, res, next) => {
    new SuccessResponse({
      message: 'unpublish Product successfully',
      metadata: await ProductService.unPublishProductByShop({
        product_shop: req.user.userId,
        product_id: req.params.id,
      }),
    }).send(res);
  };

  getAllDraftForShop = async (req, res, next) => {
    new SuccessResponse({
      message: 'get all draft for shop successfully',
      metadata: await ProductService.findAllDraftsForShop({
        product_shop: req.user.userId,
      }),
    }).send(res);
  };

  getAllPublishedForShop = async (req, res, next) => {
    new SuccessResponse({
      message: 'get all published for shop successfully',
      metadata: await ProductService.findAllPublishedForShop({
        product_shop: req.user.userId,
      }),
    }).send(res);
  };
}

module.exports = new ProductController();
