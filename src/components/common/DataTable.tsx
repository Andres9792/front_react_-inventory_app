import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
} from "@mui/material";

type Align = "right" | "left" | "center";

interface Column<T extends Record<string, unknown>> {
  id: keyof T;
  label: string;
  minWidth?: number;
  align?: Align;
  format?: (value: T[keyof T], row: T) => React.ReactNode;
}

interface DataTableProps<T extends Record<string, unknown>> {
  columns: Column<T>[];
  rows: T[];
  page: number;
  rowsPerPage: number;
  onPageChange: (event: unknown, newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const DataTable = <T extends Record<string, unknown>,>({
  columns,
  rows,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
}: DataTableProps<T>) => (
  <Paper sx={{ width: "100%", overflow: "hidden" }}>
    <TableContainer sx={{ maxHeight: 440 }}>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            {columns.map((col) => (
              <TableCell
                key={String(col.id)}
                align={col.align}
                style={{ minWidth: col.minWidth }}
              >
                {col.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {rows
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((row, index) => (
              <TableRow hover key={index}>
                {columns.map((col) => {
                  const value = row[col.id];

                  return (
                    <TableCell key={String(col.id)} align={col.align}>
                      {col.format ? col.format(value, row) : String(value ?? "")}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>

    <TablePagination
      rowsPerPageOptions={[5, 10, 25]}
      component="div"
      count={rows.length}
      rowsPerPage={rowsPerPage}
      page={page}
      onPageChange={onPageChange}
      onRowsPerPageChange={onRowsPerPageChange}
    />
  </Paper>
);
