const { BadRequestError } = require('../core/error.response');
const { product, clothes, shoes, electronics } = require('../models/product.model');
const {
  findAllDraftsForShop,
  findAllPublishedForShop,
  publishProductByShop,
  unPublishProductByShop,
} = require('../repositories/product.repo');

// define Factory class to create product
class ProductFactory {
  static productClasses = {}; // key - class

  static registerProductClass(type, classRef) {
    ProductFactory.productClasses[type] = classRef;
  }

  static async createProduct(type, payload) {
    const productClass = ProductFactory.productClasses[type];

    if (!productClass) throw new BadRequestError(`Invalid product type ${type}`);

    return new productClass(payload).createProduct();
  }

  static async findAllDraftsForShop({ product_shop, limit = 50, skip = 0 }) {
    const query = { product_shop, isDraft: true };
    return await findAllDraftsForShop({ query, limit, skip });
  }

  static async findAllPublishedForShop({ product_shop, limit = 50, skip = 0 }) {
    const query = { product_shop, isPublished: true };
    return await findAllPublishedForShop({ query, limit, skip });
  }

  static async publishProductByShop({ product_shop, product_id }) {
    return await publishProductByShop({ product_shop, product_id });
  }

  static async unPublishProductByShop({ product_shop, product_id }) {
    return await unPublishProductByShop({ product_shop, product_id });
  }
}

// define class base product
class Product {
  constructor({
    product_name,
    product_thumb,
    product_description,
    product_price,
    product_quantity,
    product_type,
    product_shop,
    product_attributes,
  }) {
    this.product_name = product_name;
    this.product_thumb = product_thumb;
    this.product_description = product_description;
    this.product_price = product_price;
    this.product_quantity = product_quantity;
    this.product_type = product_type;
    this.product_shop = product_shop;
    this.product_attributes = product_attributes;
  }

  async createProduct(productId) {
    return await product.create({ ...this, _id: productId });
  }
}

class Clothing extends Product {
  async createProduct() {
    const newClothing = await clothes.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newClothing) throw BadRequestError('create new clothing error');

    const newProduct = super.createProduct(newClothing._id);
    if (!newProduct) throw BadRequestError('create new product error');

    return newProduct;
  }
}

class Shoes extends Product {
  async createProduct() {
    const newShoes = await shoes.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newShoes) throw BadRequestError('create new shoes error');

    const newProduct = super.createProduct(newShoes._id);
    if (!newProduct) throw BadRequestError('create new product error');

    return newProduct;
  }
}
class Electronics extends Product {
  async createProduct() {
    const newElectronic = await electronics.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newElectronic) throw BadRequestError('create new electronic error');

    const newProduct = super.createProduct(newElectronic._id);
    if (!newProduct) throw BadRequestError('create new product error');

    return newProduct;
  }
}

// register product class
ProductFactory.registerProductClass('Clothes', Clothing);
ProductFactory.registerProductClass('Electronics', Electronics);
ProductFactory.registerProductClass('Shoes', Shoes);

module.exports = ProductFactory;
