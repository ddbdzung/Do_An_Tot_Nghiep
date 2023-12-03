const cloudinary = require('../config/cloudinary');
const { Readable } = require('stream');

exports.uploadFile = async image =>
  cloudinary.uploader.upload(image, {
    upload_preset: 'xpxrhmr4',
  });

exports.deleteFiles = async ids => cloudinary.api.delete_resources(ids);

exports.uploadStream = async buffer => {
  return new Promise((resolve, reject) => {
    const theTransformStream = cloudinary.uploader.upload_stream(
      {
        upload_preset: 'xpxrhmr4',
      },
      (err, result) => {
        if (err) return reject(err);

        resolve(result);
      },
    );
    let str = Readable.from(buffer);
    str.pipe(theTransformStream);
  });
};
