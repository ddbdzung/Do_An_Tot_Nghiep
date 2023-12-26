const permission = {
  // SinhVien module permisstion
  SINHVIEN: {
    GET_SINHVIEN: 'get_sinhVien',
    MANAGE_SINHVIEN: 'manage_sinhVien',
    DELETE_SINHVIEN: 'delete_sinhVien',
  },

  // new permistion in here
  ROLE: {
    GET_ROLE: 'get_role',
    MANAGE_ROLE: 'manage_role',
    DELETE_ROLE: 'delete_role',
  },

  // transaction module
  TRANSACTION: {
    GET_TRANSACTIONS: 'get_transactions',
    CREATE_TRANSACTION: 'create_transaction',
    UPDATE_TRANSACTIONS: 'update_transactions',
  },

  // progress module
  PROGRESS: {
    GET_PROGRESS: 'get_progress',
    GET_PROGRESSES: 'get_progresses',
    UPDATE_PROGRESS: 'update_progress',
    MANAGE_PROGRESSES: 'manage_progresses',
  },

  // school module
  SCHOOL: {
    CREATE_SCHOOL: 'create_school',
    GET_SCHOOLS: 'get_schools',
  },

  // user module for admin permistion
  USER: {
    GET_USERS: 'get_user',
    MANAGE_USER: 'manage_user',
    DELETE_USER: 'delete_user',
  },

  // pack-service module
  PACK_SERVICE: {
    GET_PACK_SERVICES: 'get_pack_services',
    CREATE_PACK_SERVICE: 'create_pack_service',
    UPDATE_PACK_SERVICE: 'update_pack_service',
    DELETE_PACK_SERVICE: 'delete_pack_service',
  },

  // product module
  PRODUCT: {
    GET_PRODUCT: 'get_product',
    GET_PRODUCTS: 'get_products',
    CREATE_PRODUCT: 'create_product',
    UPDATE_PRODUCT: 'update_product',
    DELETE_PRODUCT: 'delete_product',
  },

  // category module
  CATEGORY: {
    GET_CATEGORIES: 'get_categories',
    GET_CATEGORY: 'get_category',
    CREATE_CATEGORY: 'create_category',
    UPDATE_CATEGORY: 'update_category',
    DELETE_CATEGORY: 'delete_category',
  },

  CART: {
    GET_CART: 'get_cart',
    CREATE_CART: 'create_cart',
    UPDATE_CART: 'update_cart',
    DELETE_CART: 'delete_cart',
  },
};
const permissionArr = Object.values(permission).reduce((pNow, pCurrent) => {
  let pNowTemp = pNow;
  if (typeof pNow === 'object') {
    pNowTemp = Object.values(pNow);
  }
  return [...pNowTemp, ...Object.values(pCurrent)];
});

module.exports = {
  permission,
  permissionArr,
};
