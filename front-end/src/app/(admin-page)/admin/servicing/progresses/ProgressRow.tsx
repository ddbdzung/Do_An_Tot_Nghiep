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
import { IProgress } from "@/api/progress/dto/progress.dto";
import {
  PROGRESS_STATUS,
  TRANSACTION_STATUS,
} from "@/app/(landing-page)/(accounts)/account-order/page";
import Link from "next/link";

function Row(props: { row: IProgress }) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { row } = props;
  const [open, setOpen] = React.useState(false);

  const handleViewDetailBtn = () => {
    notifyError("This feature is not available yet");
    return;
    // router.push(`/admin/servicing/progresses/${row.id}/v`);
  };
  const handleEditBtn = () => {
    router.push(`/admin/servicing/progresses/${row.id}/u`);
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
        <TableCell align="left">
          <Link
            style={{ textDecoration: "none" }}
            href={`/admin/manage/orders/${row?.transaction?.id}/u`}
          >
            {row?.transaction?.id}
          </Link>
        </TableCell>
        <TableCell align="left">{row?.customer?.name}</TableCell>
        <TableCell align="left">
          {TRANSACTION_STATUS[row?.transaction?.status]}
        </TableCell>
        <TableCell align="left">{PROGRESS_STATUS[row?.status]}</TableCell>
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
