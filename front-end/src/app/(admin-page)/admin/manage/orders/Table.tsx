"use client";

import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import Row from "./OrderRow";
import React, { useEffect, useState } from "react";
import { ITransaction } from "@/api/transactions/dto/transaction.dto";
import _ from "lodash";

export type headersType = {
  title: string;
  align?: "left" | "right" | "center";
};

export default function CollapsibleTable(props: {
  rows: [ITransaction];
  headers: [headersType];
  status: string;
}) {
  const { rows } = props;

  return (
    <>
      <TableContainer component={Paper}>
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow>
              <TableCell />
              {props.headers?.map((header: headersType, idx) => (
                <TableCell
                  align={header.align ? header.align : "left"}
                  key={idx}
                >
                  {header.title}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {!_.isEmpty(rows) &&
              rows?.map((row) => <Row key={row.id} row={row} />)}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
