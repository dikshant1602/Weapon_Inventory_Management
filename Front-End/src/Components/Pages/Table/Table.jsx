import React from 'react';
import MUIDataTable from 'mui-datatables';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';

function Table({ data, columns, options ,records}) {
 

  return (
    <ThemeProvider theme={theme}>
      <div style={{ width: '100%' , margin: '20px'  }}>
        <MUIDataTable
          title={records}
          data={data}
          columns={columns}
          options={options}
        />
      </div>
    </ThemeProvider>
  );
}

export default Table;
