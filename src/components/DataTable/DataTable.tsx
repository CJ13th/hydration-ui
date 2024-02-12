import {
  flexRender,
  Row,
  Table as TableDefinition,
} from "@tanstack/react-table"
import { ReactNode } from "react"
import { TableSortHead } from "./components/TableSortHead"
import {
  Table,
  TableAddons,
  TableBody,
  TableCell,
  TableContainer,
  TableHeader,
  TableProps,
  TableRow,
  TableTitle,
  TableTitleContainer,
} from "./DataTable.styled"

type DataTableProps<T> = {
  table: TableDefinition<T>
  className?: string
  title?: ReactNode
  action?: ReactNode
  addons?: ReactNode
  onRowClick?: (row?: Row<T> | Record<string, any>) => void
} & TableProps

export function DataTable<T extends Record<string, any>>({
  table,
  title,
  action,
  addons,
  className,
  fixedLayout = false,
  spacing = "medium",
  size = "medium",
  background = "darkBlue700",
  borderless,
  striped,
  hoverable,
  onRowClick,
}: DataTableProps<T>) {
  const tableProps = {
    spacing,
    size,
    borderless,
    striped,
    hoverable,
    fixedLayout,
  }

  const isLoading = table.options.meta?.isLoading ?? false

  return (
    <TableContainer className={className} background={background}>
      {(title || action) && (
        <TableTitleContainer spacing={spacing}>
          {title && <TableTitle>{title}</TableTitle>}
          <div sx={{ ml: "auto" }}>{action}</div>
        </TableTitleContainer>
      )}

      {addons && <TableAddons spacing={spacing}>{addons}</TableAddons>}

      <Table {...tableProps} data-loading={`${isLoading}`}>
        <TableHeader>
          {table
            .getHeaderGroups()
            .filter((headerGroup) =>
              headerGroup.headers.some(
                (header) => !!header.column.columnDef.header,
              ),
            )
            .map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const { meta } = header.getContext().column.columnDef
                  return (
                    <TableSortHead
                      key={header.id}
                      className={meta?.className}
                      sx={meta?.sx}
                      canSort={header.column.getCanSort()}
                      sortDirection={header.column.getIsSorted()}
                      onSort={header.column.getToggleSortingHandler()}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableSortHead>
                  )
                })}
              </TableRow>
            ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow
              key={row.id}
              data-selected={row.getIsSelected()}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
              css={!!onRowClick && { cursor: "pointer" }}
            >
              {row.getVisibleCells().map((cell) => {
                const { meta } = cell.getContext().cell.column.columnDef
                return (
                  <TableCell
                    key={cell.id}
                    className={meta?.className}
                    sx={meta?.sx}
                  >
                    {onRowClick && !isLoading ? (
                      <div
                        css={{
                          display: "inline-flex",
                          width: "fit-content",
                          cursor: "auto",
                        }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </div>
                    ) : (
                      flexRender(cell.column.columnDef.cell, cell.getContext())
                    )}
                  </TableCell>
                )
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
