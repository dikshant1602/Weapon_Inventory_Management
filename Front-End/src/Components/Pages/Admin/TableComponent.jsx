import React from 'react';
import { useTable } from 'react-table';

const TableComponent = ({ columns, data }) => {
    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({ columns, data });

    return (
        <table {...getTableProps()} style={{ width: '100%', borderCollapse: 'collapse', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)' }}>
            <thead>
                {headerGroups.map(headerGroup => (
                    <tr {...headerGroup.getHeaderGroupProps()} style={{ backgroundColor: '#1f372f' }}>
                        {headerGroup.headers.map(column => (
                            <th
                                {...column.getHeaderProps()}
                                style={{
                                    padding: '12px',
                                    border: '1px solid #1c170ed2',
                                    color: 'white',
                                    textAlign: 'center', // Center-align text
                                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)',
                                }}
                            >
                                {column.render('Header')}
                            </th>
                        ))}
                    </tr>
                ))}
            </thead>
            <tbody {...getTableBodyProps()}>
                {rows.map(row => {
                    prepareRow(row);
                    return (
                        <tr {...row.getRowProps()} style={{ backgroundColor: '#1c170ed2' }}>
                            {row.cells.map(cell => (
                                <td
                                    {...cell.getCellProps()}
                                    style={{
                                        padding: '12px',
                                        border: '1px solid #1c170ed2',
                                        color: 'white',
                                        textAlign: 'center', // Center-align text
                                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)',
                                    }}
                                >
                                    {cell.render('Cell')}
                                </td>
                            ))}
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
};

export default TableComponent;
