// COP: Category of Product
exports.CATEGORY_CODE = {
  // Máy lọc nước
  WATER_PURIFIER: 'COP1',
  // Vòi lấy nước
  WATER_TAP: 'COP2',
  // Lõi lọc nước
  WATER_FILTER: 'COP3',
  // Adapter
  ADAPTER: 'COP4',
  // Đèn UV diệt khuẩn
  UV_LIGHT: 'COP5',
};

exports.CATEGORY_NEED_INSTALL = [
  this.CATEGORY_CODE.WATER_PURIFIER,
  this.CATEGORY_CODE.WATER_FILTER,
];
