import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#4caf50', // Optional: customize primary color
    },
    background: {
      default: '#1c170ed2', // Updated background color for default elements
      paper: '#1c170ed2', // Updated background color for paper elements
    },
    text: {
      primary: '#ffffff', // White text color
      secondary: '#bdbdbd', // Optional: secondary text color
    },
  },
  components: {
    MuiTable: {
      styleOverrides: {
        root: {
          width: '100%', // Full width for the table
          backgroundColor: '#1c170ed2', // Updated background color for the table
          color: '#ffffff', // Text color for the table
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: '#1c170ed2', // Updated background color for table headers
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: '1px solid #444', // Bottom border for cells
          textAlign: 'center', // Center-align text in table cells
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: '#2b251eb3', // Updated darker background on hover
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          '&.Mui-checked': {
            color: '#4caf50', // Green color for checked checkboxes
          },
        },
      },
    },
    MuiTablePagination: {
      styleOverrides: {
        toolbar: {
          backgroundColor: '#1c170ed2', // Updated background color for pagination toolbar
          color: '#ffffff', // Text color for pagination toolbar
        },
      },
    },
  },
});

export default theme;
