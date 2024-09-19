/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useMemo, SetStateAction, ReactNode } from 'react';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import PlayCircleFilledIcon from '@mui/icons-material/PlayCircleFilled';

import { EnhancedTableHead } from './EnhancedTableHead';

import { getComparator, stableSort } from '../../helpers/utils';

type DataGridProps = {
    children?: ReactNode,
    contentHeader?: ReactNode,
    headCells: Array<{ id: string; label: string; disableSort?: boolean; render?: (rowData: any) => ReactNode, sorter: any }>,
    rows: Array<any>,
    setAction?: React.Dispatch<React.SetStateAction<"EDIT" | "NEW" | "DELETE" | null>>,
    setData?: (data: Array<any>) => void,
    defaultOrder?: 'asc' | 'desc',
    defaultOrderBy?: string,
    showEditAction?: boolean,
    showDeleteAction?: boolean
    showPlayAction?: () => void
}

export function DataGrid({
    children = undefined,
    headCells = [],
    rows = [],
    setAction = undefined,
    setData = undefined,
    defaultOrder = 'desc',
    defaultOrderBy = 'id',
    showEditAction = false,
    showDeleteAction = false,
    showPlayAction = undefined,
    contentHeader = undefined
}: DataGridProps) {

    const [order, setOrder] = useState(defaultOrder);
    const [orderBy, setOrderBy] = useState(defaultOrderBy);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const handleRequestSort = (_event: any, property: SetStateAction<string>) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleChangePage = (_event: any, newPage: SetStateAction<number>) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: { target: { value: string; }; }) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

    const visibleRows = useMemo(
        () =>
            stableSort(rows, getComparator(order, orderBy, headCells.find((hc: { id: string; }) => hc.id === orderBy)?.sorter)).slice(
                page * rowsPerPage,
                page * rowsPerPage + rowsPerPage,
            ),
        [order, orderBy, page, rowsPerPage, rows],
    );
    return (
        <Box sx={{ width: '100%', backgroundColor: '#fff' }}>
            <Paper sx={{ width: '100%', mb: 2 }}>
                <TableContainer>
                    <Box sx={{ marginBottom: 3 }}>
                        {contentHeader}
                    </Box>
                    <Table
                        sx={{ minWidth: 750, fontWeight: "bold" }}
                        aria-labelledby="tableTitle"
                        size="small"
                    >
                        <EnhancedTableHead
                            headCells={headCells}
                            order={order}
                            orderBy={orderBy}
                            onRequestSort={handleRequestSort}
                        />
                        <TableBody>
                            {
                                visibleRows && visibleRows.length > 0 ? (
                                    visibleRows.map((row, index) => {
                                        return (
                                            <TableRow
                                                role="checkbox"
                                                tabIndex={-1}
                                                key={row.id}
                                            >
                                                <TableCell>
                                                    <Box sx={{
                                                        display: "flex",
                                                        justifyContent: "center",
                                                        alignItems: "center",
                                                        padding: "1px",
                                                        gap: "1rem",
                                                        width: "auto",
                                                    }}>
                                                        {typeof showPlayAction === 'function' &&
                                                            <Tooltip
                                                                title="Presentar - Presione ESC para terminar"
                                                                onClick={() => {
                                                                    if (setData) setData(
                                                                        rows.find(
                                                                            (r: { id: any; }) => r.id === row.id
                                                                        )
                                                                    );
                                                                    showPlayAction()
                                                                }}
                                                            >
                                                                <IconButton>
                                                                    <PlayCircleFilledIcon />
                                                                </IconButton>
                                                            </Tooltip>
                                                        }
                                                        {showEditAction &&
                                                            <Tooltip
                                                                title="Editar"
                                                                onClick={() => {
                                                                    if (setData) setData(
                                                                        rows.find(
                                                                            (r: { id: any; }) => r.id === row.id
                                                                        )
                                                                    );
                                                                    if (setAction) setAction("EDIT");
                                                                }}
                                                            >
                                                                <IconButton>
                                                                    <EditIcon />
                                                                </IconButton>
                                                            </Tooltip>
                                                        }
                                                        {showDeleteAction &&
                                                            <Tooltip
                                                                title="Borrar"
                                                                onClick={() => {
                                                                    if (setData) setData(
                                                                        rows.find(
                                                                            (r: { id: any; }) => r.id === row.id
                                                                        )
                                                                    );
                                                                    if (setAction) setAction("DELETE");
                                                                }}
                                                            >
                                                                <IconButton aria-label="delete">
                                                                    <DeleteForeverIcon />
                                                                </IconButton>
                                                            </Tooltip>
                                                        }
                                                    </Box>
                                                </TableCell>
                                                {headCells
                                                    .map((cell: any) => cell.accessor)
                                                    .map((accessor: any, idx: number) => (
                                                        <TableCell
                                                            key={idx}
                                                            align="inherit"
                                                        >
                                                            {typeof accessor === "function"
                                                                ? accessor(row, index)
                                                                : row[accessor]}
                                                        </TableCell>
                                                    ))}
                                            </TableRow>
                                        );
                                    })
                                ) : (
                                    <TableRow>
                                        <TableCell
                                            colSpan={headCells.length + 1}
                                            align="inherit"
                                            sx={{
                                                fontSize: "1rem",
                                                textAlign: 'center'
                                            }}
                                        >
                                            No se encontraron registros
                                        </TableCell>
                                    </TableRow>
                                )
                            }
                            {emptyRows > 0 && (
                                <TableRow style={{ height: 33 * emptyRows }}>
                                    <TableCell colSpan={headCells.length + 1} />
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={rows.length}
                    rowsPerPage={rowsPerPage}
                    labelRowsPerPage="Registros por página"
                    labelDisplayedRows={({ from, to, count }) => `${from}–${to} de ${count}`}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
            {children}
        </Box>
    );
}