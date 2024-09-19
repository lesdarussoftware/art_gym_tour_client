/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, TableCell, TableRow } from '@mui/material'
import TableHead from '@mui/material/TableHead'
import TableSortLabel from '@mui/material/TableSortLabel'
import { visuallyHidden } from '@mui/utils'
import { Key, ReactElement, JSXElementConstructor, ReactNode, ReactPortal } from 'react'

type Props = {
    headCells: any;
    order: any;
    orderBy: any;
    onRequestSort: any;
}

export function EnhancedTableHead({
    headCells,
    order,
    orderBy,
    onRequestSort,
}: Props) {

    const createSortHandler = (property: any) => (event: any) => {
        onRequestSort(event, property)
    }

    return (
        <TableHead>
            <TableRow>
                <TableCell />
                {headCells.map((headCell: { id: Key | null | undefined; disablePadding: any; label: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined }) => (
                    <TableCell
                        key={headCell.id}
                        className='font-bold flex-1 px-4 py-1'
                        align="inherit"
                        padding={headCell.disablePadding ? 'none' : 'normal'}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <Box component="span" sx={visuallyHidden}>
                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                </Box>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    )
}