const toPlainObject = o => {
  if (o !== null && typeof o === 'object' && !Array.isArray(o)) {
    return {
      ...Object.keys(o).reduce((a, c) => ((a[c] = toPlainObject(o[c])), a), {}),
    };
  }

  return o;
};

module.exports = {
  toPlainObject,
};
