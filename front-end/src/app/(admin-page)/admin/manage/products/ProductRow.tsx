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
import { IProduct } from "@/api/product/dto/get-products.dto";
import { formatDateToLocale } from "@/utils/formatDate";
import { useRouter } from "next/navigation";

function Row(props: { row: IProduct }) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { row } = props;
  const [open, setOpen] = React.useState(false);
  const handleViewDetail = () => {
    router.push(`/admin/manage/products/${row.id}`);
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
        <TableCell align="left">{row.category.name}</TableCell>
        <TableCell align="left">{row.brand}</TableCell>
        <TableCell align="right">{row.price.lastValue}</TableCell>
        <TableCell align="right">{row.quantity}</TableCell>
        <TableCell align="left">{formatDateToLocale(row.updatedAt)}</TableCell>
        <TableCell align="center">
          <Button variant="outlined" onClick={handleViewDetail}>
            View
          </Button>
          <Button variant="outlined">Edit</Button>
          <Button variant="outlined">Delete</Button>
        </TableCell>
      </TableRow>

      <TableRow>
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
                      <TableCell align="left">{price.createdAt}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

export default Row;
