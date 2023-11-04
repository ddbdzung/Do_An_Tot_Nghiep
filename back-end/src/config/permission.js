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
};
const permissionArr = Object.values(permission).reduce((pNow, pCurren) => {
  let pNowTemp = pNow;
  if (typeof pNow === 'object') {
    pNowTemp = Object.values(pNow);
  }
  return [...pNowTemp, ...Object.values(pCurren)];
});

module.exports = {
  permission,
  permissionArr,
};
