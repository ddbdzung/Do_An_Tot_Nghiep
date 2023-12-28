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
    title: "Phone Number",
    align: "left",
  },
  {
    title: "Age",
    align: "right",
  },
  {
    title: "Responsibility",
    align: "left",
  },
];

export default function BasicTable<T>({ rows }: { rows: any[] }) {
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
                <TableCell align="left">{row?.name}</TableCell>
                <TableCell align="left">{row?.phoneNumber}</TableCell>
                <TableCell align="right">{row?.age}</TableCell>
                <TableCell align="left">{row?.responsibility}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </React.Fragment>
  );
}
