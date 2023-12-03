const logger = require('../config/logger');
const { Category } = require('../models');
const ApiError = require('../utils/ApiError');

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

exports.createCategory = async createCategoryDto => {
  try {
    const category = await Category.create(createCategoryDto);
    return category;
  } catch (err) {
    if (err.code === 11000) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Category already taken');
    }

    throw err;
  }
};

exports.updateCategoryById = async (categoryId, updateCategoryDto) => {
  const category = await Category.findByIdAndUpdate(
    categoryId,
    updateCategoryDto,
    { new: true },
  );

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
