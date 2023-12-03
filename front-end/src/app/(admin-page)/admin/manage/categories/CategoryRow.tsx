import {
  Box,
  Button,
  Collapse,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import React from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { useAppDispatch } from "@/redux/hooks";
import { formatDateToLocale } from "@/utils/formatDate";
import { useRouter } from "next/navigation";
import { ICategory } from "@/api/category/dto/category.dto";

function Row(props: {
  row: ICategory;
  handleDeleteItem: (id: string, name: string) => void;
}) {
  const { handleDeleteItem, name } = props;
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { row } = props;
  const [open, setOpen] = React.useState(false);

  const handleViewDetailBtn = () => {
    router.push(`/admin/manage/categories/${row.id}/v`);
  };
  const handleEditBtn = () => {
    router.push(`/admin/manage/categories/${row.id}/u`);
  };
  const handleDeleteBtn = () => {
    handleDeleteItem(row.id, row.name);
  };

  return (
    <React.Fragment>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell align="left">{row.name}</TableCell>
        <TableCell align="left">{formatDateToLocale(row.updatedAt)}</TableCell>
        <TableCell align="left">{formatDateToLocale(row.createdAt)}</TableCell>
        <TableCell align="center">
          <Button
            variant="outlined"
            onClick={handleViewDetailBtn}
            style={{ marginLeft: "4px", marginRight: "4px" }}
          >
            View
          </Button>
          <Button
            variant="outlined"
            onClick={handleEditBtn}
            style={{ marginLeft: "4px", marginRight: "4px" }}
          >
            Edit
          </Button>
          <Button
            variant="outlined"
            onClick={handleDeleteBtn}
            style={{ marginLeft: "4px", marginRight: "4px" }}
          >
            Delete
          </Button>
        </TableCell>
      </TableRow>
      {/* <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Price History
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell align="right">Value</TableCell>
                    <TableCell align="left">Created At</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.price.history.map((price) => (
                    <TableRow key={price._id}>
                      <TableCell align="right">{price.value}</TableCell>
                      <TableCell align="left">
                        {formatDateToLocale(price.createdAt)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow> */}
    </React.Fragment>
  );
}

export default Row;
