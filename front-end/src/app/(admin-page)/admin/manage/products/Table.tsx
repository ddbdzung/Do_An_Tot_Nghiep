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
  return (
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell />
            {props.headers?.map((header: headersType, idx) => (
              <TableCell align={header.align ? header.align : "left"} key={idx}>
                {header.title}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {Array.isArray(rows) &&
            rows?.length > 0 &&
            rows?.map((row) => <Row key={row.id} row={row} />)}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
