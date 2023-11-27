const mongoose = require('mongoose');
const config = require('../config/config');

const { url, options } = config.mongoose;
const connectMongodb = async () => {
  try {
    await mongoose.connect(url, options);
    console.log('Connect mongodb successfully');
  } catch (error) {
    console.log('Connect mongodb failed');
  }
};

module.exports = {
  connectMongodb,
};
