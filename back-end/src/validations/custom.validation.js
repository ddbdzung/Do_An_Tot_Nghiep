const objectId = (value, helpers) => {
  if (!value.match(/^[0-9a-fA-F]{24}$/)) {
    return helpers.message('"{{#label}}" must be a valid mongo id');
  }
  return value;
};

const password = (value, helpers) => {
  if (value.length < 8) {
    return helpers.message('password must be at least 8 characters');
  }
  if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
    return helpers.message('password must contain at least 1 letter and 1 number');
  }
  return value;
};
const units = {
  k: 1000,
  m: 1000000,
  b: 1000000000,
};

const price = (value, helpers) => {
  let deSerializeValue;
  try {
    deSerializeValue = JSON.parse(value);
  } catch (err) {
    return helpers.message('price must be a valid json type number');
  }

  const { min, max } = deSerializeValue;
  if (min === undefined || max === undefined) {
    return helpers.message('price must contain min and max');
  }

  if (min > max) {
    return helpers.message('price.min must be less than price.max');
  }

  if (min < 0) {
    return helpers.message('price must be greater than 0');
  }

  return { min: min * units.k, max: max * units.k };
};

const categoryIds = (value, helpers) => {
  let deSerializeValue;
  try {
    deSerializeValue = JSON.parse(value);
  } catch (err) {
    return helpers.message('categoryIds must be a valid json type array');
  }

  if (!Array.isArray(deSerializeValue)) {
    return helpers.message('categoryIds must be a valid json type array');
  }

  if (deSerializeValue.length === 0) {
    return [];
  }

  for (let i = 0; i < deSerializeValue.length; i++) {
    if (!deSerializeValue.at(i).match(/^[0-9a-fA-F]{24}$/)) {
      return helpers.message('"{{#label}}" must be a valid mongo id');
    }
  }

  return deSerializeValue;
};

module.exports = {
  objectId,
  password,
  price,
  categoryIds,
};
