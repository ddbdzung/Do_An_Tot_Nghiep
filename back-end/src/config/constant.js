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
  PAYPAL: 'paypal',
  MOMO: 'momo',
  INTERNET_BANKING: 'internet-banking',
};
const TRANSACTION_STATUS = {
  PREPARING: 'preparing',
  DELIVERING: 'delivering',
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
