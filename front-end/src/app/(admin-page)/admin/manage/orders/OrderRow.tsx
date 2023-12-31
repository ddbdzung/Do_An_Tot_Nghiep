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
import { ITransaction } from "@/api/transactions/dto/transaction.dto";
import formatVnCurrency from "@/utils/formatVnCurrency";
import { notifyError } from "@/utils/notify";
import { TRANSACTION_STATUS } from "@/app/(landing-page)/(accounts)/account-order/page";

function Row(props: { row: ITransaction }) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { row } = props;
  const [open, setOpen] = React.useState(false);

  const handleViewDetailBtn = () => {
    notifyError("This feature is not available yet");
    return;
  };
  const handleEditBtn = () => {
    router.push(`/admin/manage/orders/${row.id}/u`);
  };
  const calcTotalPrice = (row: ITransaction) => {
    return row.products.reduce(
      (acc, cur) => acc + cur?.productDetail?.price * cur.amount,
      0
    );
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
        <TableCell align="left">{row?.customerInfo?.name}</TableCell>
        <TableCell align="right">{row?.customerInfo?.phoneNumber}</TableCell>
        <TableCell align="left">{TRANSACTION_STATUS[row?.status]}</TableCell>
        <TableCell align="left">
          {formatVnCurrency(calcTotalPrice(row))}
        </TableCell>
        <TableCell align="left">{formatDateToLocale(row?.updatedAt)}</TableCell>
        <TableCell align="left">{formatDateToLocale(row?.createdAt)}</TableCell>
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
            disabled={true}
            style={{ marginLeft: "4px", marginRight: "4px" }}
          >
            Delete
          </Button>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

export default Row;
