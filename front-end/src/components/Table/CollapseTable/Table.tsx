import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import Row from "./Row";

export type rowsType = {
  [key: string]: any;
};

export type headersType = {
  title: string;
  align?: "left" | "right" | "center";
};

export default function CollapsibleTable(props: {
  rows: [rowsType];
  headers: [headersType];
  status: string;
}) {
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
          {props.rows?.map((row, idx) => (
            <Row key={idx} row={row} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
