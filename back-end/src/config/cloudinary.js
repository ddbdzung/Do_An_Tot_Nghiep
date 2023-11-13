const { v2: cloudinary } = require('cloudinary');

const config = require('../config/config');

cloudinary.config({
  cloud_name: config.cloudName,
  api_key: config.apiKey,
  api_secret: config.apiSecret,
});

module.exports = { cloudinary };
