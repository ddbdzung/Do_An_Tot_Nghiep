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
import Row from "./ProductRow";
import { IProduct } from "@/api/product/dto/get-products.dto";
import DraggableDialog from "./DeleteProductModal";
import React from "react";

export type headersType = {
  title: string;
  align?: "left" | "right" | "center";
};

export default function CollapsibleTable(props: {
  rows: [IProduct];
  headers: [headersType];
  status: string;
}) {
  const { rows } = props;
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [selectedId, setSelectedId] = React.useState("");
  const [selectedProductName, setSelectedProductName] = React.useState("");
  const handleDeleteProduct = (id: string, productName: string) => {
    setDeleteDialogOpen(true);
    setSelectedId(id);
    setSelectedProductName(productName);
  };

  return (
    <>
      <DraggableDialog
        open={deleteDialogOpen}
        setOpen={setDeleteDialogOpen}
        title="Warning"
        content="You are deleting product:"
        confirmText="Delete"
        id={selectedId}
        productName={selectedProductName}
      />
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
            {Array.isArray(rows) &&
              rows?.length > 0 &&
              rows?.map((row) => (
                <Row
                  key={row.id}
                  row={row}
                  handleDeleteProduct={handleDeleteProduct}
                />
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
