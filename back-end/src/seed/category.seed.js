const { CATEGORY_CODE } = require('../common/constants.common');
const logger = require('../config/logger');
const Category = require('../models/category.model');

const categories = [
  {
    name: 'Máy lọc nước',
    code: CATEGORY_CODE.WATER_PURIFIER,
  },
  {
    name: 'Vòi lấy nước',
    code: CATEGORY_CODE.WATER_TAP,
  },
  {
    name: 'Lõi lọc nước',
    code: CATEGORY_CODE.WATER_FILTER,
  },
  {
    name: 'Adapter',
    code: CATEGORY_CODE.ADAPTER,
  },
  {
    name: 'Đèn UV diệt khuẩn',
    code: CATEGORY_CODE.UV_LIGHT,
  },
];

async function seedCategory() {
  const cate = await Category.findOne();
  if (cate) {
    logger.warn('Category not empty');
    return;
  }

  try {
    await Category.insertMany(categories);
    logger.info('Category seeding completed');
  } catch (ex) {
    logger.error('Category seeding failed', ex);
    throw ex;
  }
}

module.exports = seedCategory;
