const logger = require('../config/logger');
const { Category, Product } = require('../models');
const ApiError = require('../utils/ApiError');
const { uploadStream } = require('./image.service');

exports.getCategoryById = async (
  id,
  options = {
    lean: false,
    projection: {},
  },
) => {
  const category = await Category.findById(id, {}, options);
  if (!category || category.deletedAt) {
    return null;
  }

  return category;
};

exports.queryCategories = async (filter, options) => {
  const categories = await Category.paginate(filter, options);
  const { results, ...rest } = categories;
  const resultsNotDeleted = results.filter(category => !category.deletedAt);
  return {
    results: resultsNotDeleted,
    ...rest,
  };
};

exports.queryCategoriesWithMetadata = async (filter, options) => {
  const categories = await Category.paginate(filter, options, { lean: true });
  const { results, ...rest } = categories;
  const resultsNotDeleted = results.filter(category => !category.deletedAt);
  const productCount = await Promise.all(
    resultsNotDeleted.map(async category => {
      return Product.countDocuments({
        category: category._id,
        deletedAt: null,
      });
    }),
  );
  const resultsWithMetadata = resultsNotDeleted.map(
    ({ __v, _id, ...category }, index) => {
      return {
        id: _id,
        ...category,
        productCount: productCount[index],
      };
    },
  );
  return {
    results: resultsWithMetadata,
    ...rest,
  };
};

exports.createCategory = async createCategoryDto => {
  try {
    const { images, ...categoryDto } = createCategoryDto;

    const imgs = [];
    if (images !== undefined && Array.isArray(images) && images.length > 0) {
      const uploadedImg = await uploadStream(images[0].blob);
      imgs.push({
        pos: images[0].pos,
        url: uploadedImg.public_id,
      });
      categoryDto.images = imgs;
    }
    const category = await Category.create(categoryDto);

    return category;
  } catch (err) {
    if (err.code === 11000) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Category already taken');
    }

    throw err;
  }
};

exports.updateCategoryById = async (categoryId, updateCategoryDto) => {
  console.log('updateCategoryDto', updateCategoryDto);
  const { images, ...categoryDto } = updateCategoryDto;
  const imgs = [];
  if (images !== undefined && Array.isArray(images) && images.length > 0) {
    const uploadedImg = await uploadStream(images[0].blob);
    imgs.push({
      pos: images[0].pos,
      url: uploadedImg.public_id,
    });
    categoryDto.images = imgs;
  }

  const category = await Category.findByIdAndUpdate(categoryId, categoryDto, {
    new: true,
  });

  if (!category) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Category not found');
  }

  return category;
};

exports.softDeleteCategory = async categoryId => {
  const category = await Category.findByIdAndUpdate(
    categoryId,
    { deletedAt: Date.now() },
    { new: true },
  );

  if (!category) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Category not found');
  }

  return category;
};
