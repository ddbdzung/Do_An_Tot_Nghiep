function createData(
  id: string | number,
  name: string,
  category: string,
  brand: string,
  price: number,
  quantity: number,
  updatedAt: string
) {
  return {
    id,
    name,
    category,
    brand,
    price,
    quantity,
    updatedAt,
    history: [
      {
        date: "2020-01-05",
        customerId: "11091700",
        amount: 3,
      },
      {
        date: "2020-01-02",
        customerId: "Anonymous",
        amount: 1,
      },
    ],
  };
}

const rows = [
  createData(
    1,
    "Máy lọc nước RO nóng nguội lạnh Karofi KAD-X39 10 lõi",
    "Máy lọc nước",
    "Karofi",
    6590000,
    32,
    "2021-09-01"
  ),
  createData(
    2,
    "Máy lọc nước RO nóng nguội lạnh Kangaroo KG10A3 10 lõi",
    "Máy lọc nước",
    "Kangaroo",
    5590000,
    10,
    "2021-09-13"
  ),
  createData(
    3,
    "Máy lọc nước RO nóng nguội lạnh Hòa Phát HPN635 10 lõi",
    "Máy lọc nước",
    "Hòa Phát",
    5590000,
    10,
    "2021-09-13"
  ),
  createData(
    4,
    "Máy lọc nước RO nóng nguội lạnh Sunhouse SHR76210CK 10 lõi",
    "Máy lọc nước",
    "Sunhouse",
    5590000,
    10,
    "2021-09-13"
  ),
];
export default rows;
