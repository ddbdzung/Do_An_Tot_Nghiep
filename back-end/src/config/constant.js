const GENDER = {
  Male: 'Nam',
  Female: 'Nữ',
};
const STATUS = {
  Active: 'active',
  Lock: 'lock',
  Delete: 'delete',
};
const GRADE_TYPE = {
  PRIMARY: 'primary',
  SECONDARY: 'secondary',
  HIGH: 'high',
  PRIMARY_SECONDARY: 'primary & secondary',
  PRIMARY_HIGH: 'primary & high',
  SECONDARY_HIGH: 'secondary & high',
  PRIMARY_SECONDARY_HIGH: 'primary & secondary & high',
  UNIVERSITY: 'university',
};
const TRANSCTION_METHODS = {
  COD: 'cod', // cash on delivery
  BANK_TRANSFER: 'bank_transfer',
  PAYPAL: 'paypal',
  MOMO: 'momo',
  ZALOPAY: 'zalopay',
};
const TRANSACTION_STATUS = {
  PREPARING: 'preparing',
  DELIVERING: 'delivering',
  DELIVERED: 'delivered',
  CANCEL: 'cancel',
  RETURN: 'return',
  DONE: 'done',
};
module.exports = {
  GENDER,
  STATUS,
  GRADE_TYPE,
  TRANSCTION_METHODS,
  TRANSACTION_STATUS,
};
