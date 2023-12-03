const { v2: cloudinary } = require('cloudinary');

const config = require('../config/config');

cloudinary.config({
  cloud_name: config.multimedia.cloudName,
  api_key: config.multimedia.apiKey,
  api_secret: config.multimedia.apiSecret,
});

module.exports = cloudinary;
