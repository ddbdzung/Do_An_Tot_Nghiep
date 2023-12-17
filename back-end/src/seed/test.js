const _ = require('lodash');
const Mongoose = require('mongoose');

// const prods = require('./product.seed.js');
const id = new Mongoose.Types.ObjectId();
const products = [
  {
    _id: id,
    name: 'product 1',
    price: 100,
  },
];
console.log('products', products);
const x = _.keyBy(products, '_id');
console.log('🚀 ~ file: test.js:14 ~ x:', x);
const id2 = id.toString();
const y = x[id2];
console.log('y', y);
