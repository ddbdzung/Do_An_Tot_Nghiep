module.exports = function (req, res, next) {
  return function (statusCode, message, data = null, meta = null) {
    res.locals.statusCode = statusCode;
    res.locals.message = message;
    if (data) {
      res.locals.data = data;
    }
    if (meta) {
      res.locals.meta = meta;
    }

    next();
  };
};
