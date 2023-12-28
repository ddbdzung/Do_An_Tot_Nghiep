/* eslint-disable */

import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import formatVnCurrency from "@/utils/formatVnCurrency";
import Link from "next/link";

// function createData(
//   name: string,
//   calories: number,
//   fat: number,
//   carbs: number,
//   protein: number
// ) {
//   return { name, calories, fat, carbs, protein };
// }

// const rows = [
//   createData("Frozen yoghurt", 159, 6.0, 24, 4.0),
//   createData("Ice cream sandwich", 237, 9.0, 37, 4.3),
//   createData("Eclair", 262, 16.0, 24, 6.0),
//   createData("Cupcake", 305, 3.7, 67, 4.3),
//   createData("Gingerbread", 356, 16.0, 49, 3.9),
// ];

type ProductDetail = {
  image: string;
  name: string;
  price: number;
};

type Product = {
  amount: number;
  price: string;
  product: string;
  _id: string;
  productDetail: ProductDetail;
};

type HeaderType = {
  title: string;
  align: "left" | "right" | "center";
};

const headers: HeaderType[] = [
  {
    title: "Name",
    align: "left",
  },
  {
    title: "Price",
    align: "right",
  },
  {
    title: "Amount",
    align: "right",
  },
  {
    title: "Total",
    align: "right",
  },
];

export default function BasicTable<T>({ rows }: { rows: Product[] }) {
  const styledRows = rows?.map((row, idx) => ({
    ...row,
    key: row._id,
  }));
  return (
    <React.Fragment>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              {headers.map((header) => (
                <TableCell align={header.align}>{header.title}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {styledRows?.map((row) => (
              <TableRow
                key={row.key}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell align="left">
                  <Link
                    style={{ textDecoration: "none" }}
                    href={`/admin/manage/products/${row.product}/v`}
                  >
                    {row.productDetail.name}
                  </Link>
                </TableCell>
                <TableCell align="right">
                  {formatVnCurrency(row.productDetail.price)}
                </TableCell>
                <TableCell align="right">{row.amount}</TableCell>
                <TableCell align="right">
                  {formatVnCurrency(row.amount * parseInt(row.price))}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </React.Fragment>
  );
}
