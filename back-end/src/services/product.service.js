const ApiError = require('../utils/ApiError');
const { Product } = require('../models/');
const httpStatus = require('http-status');
const { categoryService } = require('../services');
const Mongoose = require('mongoose');
const { uploadStream, deleteFiles } = require('./image.service');
const assureOptionalParams = require('../utils/optionalParams');

exports.getProductsByIds = async (
  ids,
  options = { lean: false, populate: '', withDeletedItem: false },
) => {
  const defaultOptions = {
    lean: false,
    populate: '',
    withDeletedItem: false,
  };
  options = assureOptionalParams(options, defaultOptions);
  const { lean, withDeletedItem } = options;
  let { populate } = options;
  if (lean) {
    populate = '';
  }
  const filter = {
    _id: {
      $in: ids,
    },
  };
  if (!withDeletedItem) {
    filter.deletedAt = null;
  }

  const products = await Product.find(filter, null, { lean });

  if (!populate) return products;

  const productsWithPopulation = await Promise.all(
    products.map(async product => {
      const productPopulate = await product.populateOption(populate);
      return productPopulate;
    }),
  );
  return productsWithPopulation;
};

exports.getProductById = async (
  id,
  options = { lean: false, populate: false },
) => {
  const { lean, populate } = options;
  const product = await Product.findById(id, null, { lean });
  if (!product || product.deletedAt) {
    return null;
  }

  if (!populate) {
    return product;
  }

  return product.populateOption('category');
};

exports.exposePublicProduct = productWithPopulation => {
  const { category, __v, _id, ...product } =
    productWithPopulation?.toObject() || {};
  if (!category) {
    return product;
  }

  product.id = _id;
  product.category = {
    id: category?._id,
    name: category?.name,
  };
  return product;
};

exports.queryProducts = async (
  filter,
  options,
  extendFilter = { price: {}, categoryIds: [] },
) => {
  const pProducts = Product.paginate(filter, options, extendFilter);
  const pProductQuantity = Product.countDocuments({
    deletedAt: null,
  });
  const [products, productQuantity] = await Promise.all([
    pProducts,
    pProductQuantity,
  ]);
  const { results, totalResults, ...rest } = products;
  const resultsWithPopulate = await Promise.all(
    results.map(async product => {
      const productPopulate = await product.populateOption('category');
      return productPopulate;
    }),
  );

  return {
    results: resultsWithPopulate,
    ...rest,
    totalResults: productQuantity,
  };
};

exports.createProduct = async createProductDto => {
  const { price, categoryId, images, ...productDto } = createProductDto;

  const priceBody = {
    lastValue: price,
    history: [
      {
        _id: new Mongoose.Types.ObjectId(),
        value: price,
      },
    ],
  };

  if (images !== undefined && Array.isArray(images) && images.length > 0) {
    const pUploadedImgs = images.map(image =>
      uploadStream(image.blob).then(res => {
        return {
          pos: image.pos,
          public_id: res.public_id,
        };
      }),
    );
    const uploadedImgs = await Promise.all(pUploadedImgs);
    const imgs = uploadedImgs.map(img => ({
      pos: img.pos,
      url: img.public_id,
    }));
    productDto.images = imgs;
  }

  productDto.category = categoryId;
  productDto.price = priceBody;
  const product = await Product.create(productDto);
  return product.populateOption('category');
};

exports.updateProductById = async (productId, updateProductDto) => {
  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }

  const {
    categoryId,
    price,
    quantity,
    name,
    detail,
    unit,
    brand,
    description,
    images,
    details,
  } = updateProductDto;

  if (categoryId) {
    const category = await categoryService.getCategoryById(categoryId, {
      lean: true,
    });
    if (!category) {
      throw new ApiError(
        httpStatus.NOT_FOUND,
        `Category not found with this id ${categoryId}`,
      );
    }

    product.category = updateProductDto.categoryId;
  }

  if (images !== undefined && Array.isArray(images) && images.length > 0) {
    const imgsToDelete = product.images.map(img => img.url);
    const pDeletedImgs = imgsToDelete.map(img => deleteFiles(img));
    await Promise.all(pDeletedImgs);
    const pUploadedImgs = images.map(image =>
      uploadStream(image.blob).then(res => ({
        pos: image.pos,
        public_id: res.public_id,
      })),
    );
    const uploadedImgs = await Promise.all(pUploadedImgs);
    const imgs = uploadedImgs.map(img => ({
      pos: img.pos,
      url: img.public_id,
    }));
    product.images = imgs;
  }

  if (price) {
    const lastValue = product.price.lastValue;
    const history = [...product.price.history];
    if (lastValue === price) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'Price must be different from last value',
      );
    }

    const oldPrice = {
      value: price,
      createdAt: Date.now(),
    };
    history.push(oldPrice);

    product.price.lastValue = price;
    product.price.history = history;
  }

  product.quantity = quantity || product.quantity;
  product.name = name || product.name;
  product.detail = detail || product.detail;
  product.unit = unit || product.unit;
  product.brand = brand || product.brand;
  product.description = description || product.description;
  product.details = details || product.details;

  return product.save();
};

exports.softDeleteProductById = async productId => {
  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }

  product.deletedAt = Date.now();
  return product.save();
};

// Substract quantity of product
exports.atomicUpdateProductQuantity = async (productId, quantity) => {
  return Product.findByIdAndUpdate(productId, {
    $inc: {
      quantity,
    },
  });
};
