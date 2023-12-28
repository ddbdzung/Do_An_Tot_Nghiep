const formatPrice = price => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(price);
};
const html = (transactionDocument, serializedProductsInTransaction) => {
  const total = transactionDocument?.products?.reduce((acc, item) => {
    const serializedItem = serializedProductsInTransaction[item.product];
    if (!serializedItem) return acc;

    return acc + serializedItem.amount * serializedItem.price;
  }, 0);
  const TAX = 8;
  const SHIPPING_FEE = 20000;
  const totalWithTaxAndShipping = total * 1.08 + 20000;

  return `<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
      body {
        font-family: Arial, sans-serif;
        line-height: 1.6;
      }
  
      table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 20px;
      }
  
      th, td {
        border: 1px solid #ddd;
        padding: 8px;
        text-align: left;
      }
  
      th {
        background-color: #f2f2f2;
      }
  
      h2 {
        color: #333;
      }
  
      .total {
        font-weight: bold;
        font-size: 1.2em;
      }
    </style>
  </head>
  <body>
    <p>
    Gửi <strong>${transactionDocument?.customerInfo?.name}</strong>,
    Đơn đặt hàng của bạn đã được tạo, vui lòng kiểm tra hóa đơn trong nội dung bên dưới.
    Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi.
    </p>
  
    <h2 align="center" style="font-style: uppercase">Hóa đơn</h2>
  
    <table>
      <thead>
        <tr>
          <th>Sản phẩm</th>
          <th>Số lượng</th>
          <th>Đơn giá</th>
          <th>Tổng tiền</th>
        </tr>
      </thead>
      <tbody>
        ${transactionDocument?.products?.map(
          item =>
            `
            <tr>
              <td>${serializedProductsInTransaction[item.product]?.name}</td>
              <td>${item.amount}</td>
              <td>${format(
                serializedProductsInTransaction[item.product]?.price || 0,
              )}</td>
              <td>${format(
                item.amount *
                  serializedProductsInTransaction[item.product]?.price || 0,
              )}</td>
            </tr>
          `,
        )}
        
        <!-- Add more rows as needed -->
      </tbody>
    </table>
  
    <p class="total">Tổng tiền các sản phẩm: ${total} VND</p>
    <p class="total">Thuế VAT: ${TAX}%</p>
    <p class="total">Shipping: ${formatPrice(SHIPPING_FEE)}</p>
    <p class="total">Tổng: ${formatPrice(totalWithTaxAndShipping)} VND</p>
  
  </body>
  </html>`;
};
module.exports = html;
