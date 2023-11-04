const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createSinhVien = {
  body: Joi.object().keys({
    HoTen: Joi.string().required(),
    Sdt: Joi.string().required()
  })
};

const getSinhViens = {
  query: Joi.object().keys({
    HoTen: Joi.string(),
    Sdt: Joi.string(),
    limit: Joi.number().integer(),
    sortBy: Joi.string(),
    populate: Joi.string(),
    page: Joi.number().integer()
  })
};

const getSinhVien = {
  params: Joi.object().keys({
    sinhVienId: Joi.string().custom(objectId)
  })
};

const updateSinhVien = {
  params: Joi.object().keys({
    sinhVienId: Joi.required().custom(objectId)
  }),
  body: Joi.object()
    .keys({
    HoTen: Joi.string().required(),
    Sdt: Joi.string().required()
    })
    .min(1)
};

const deleteSinhVien = {
  params: Joi.object().keys({
    sinhVienId: Joi.string().custom(objectId)
  })
};

module.exports = {
  createSinhVien,
  getSinhViens,
  getSinhVien,
  updateSinhVien,
  deleteSinhVien
};
