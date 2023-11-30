const cloudinary = require('../config/cloudinary');

exports.uploadFile = async image =>
  cloudinary.uploader.upload(image, {
    upload_preset: 'xpxrhmr4',
  });

exports.deleteFiles = async ids => cloudinary.api.delete_resources(ids);
