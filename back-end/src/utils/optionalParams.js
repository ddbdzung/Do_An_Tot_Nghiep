module.exports = (actualParams, defaultParams) => {
  const result = { ...defaultParams };
  for (const key in actualParams) {
    if (Object.prototype.hasOwnProperty.call(actualParams, key)) {
      result[key] = actualParams[key];
    }
  }
  return result;
};
