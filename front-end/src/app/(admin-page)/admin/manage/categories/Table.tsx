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
import Row from "./CategoryRow";
import { IProduct } from "@/api/product/dto/get-products.dto";
import DraggableDialog from "@/components/DraggableDialog";
import React from "react";
import { deleteCategoryAsync } from "@/redux/features/adminSlice";

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
  const [selectedCategoryName, setSelectedCategoryName] = React.useState("");
  const handleDeleteCategory = (id: string, name: string) => {
    setDeleteDialogOpen(true);
    setSelectedId(id);
    setSelectedCategoryName(name);
  };

  return (
    <>
      <DraggableDialog
        open={deleteDialogOpen}
        setOpen={setDeleteDialogOpen}
        title="Warning"
        content="You are deleting category:"
        confirmText="Delete"
        id={selectedId}
        itemName={selectedCategoryName}
        actionDeleteItemById={deleteCategoryAsync}
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
                  handleDeleteItem={handleDeleteCategory}
                />
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
