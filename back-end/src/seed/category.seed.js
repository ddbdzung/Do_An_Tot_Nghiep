const logger = require('../config/logger');
const Category = require('../models/category.model');

const categories = [
  {
    name: 'Máy lọc nước',
  },
  {
    name: 'Vòi lấy nước',
  },
  {
    name: 'Lõi lọc nước',
  },
  {
    name: 'Adapter',
  },
  {
    name: 'Đèn UV diệt khuẩn',
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
