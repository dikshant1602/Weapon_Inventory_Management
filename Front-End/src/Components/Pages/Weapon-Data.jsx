import React, { useState } from 'react';
import { Container, Grid, TextField, Button, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box } from '@mui/material';
import MUIDataTable from './Table/Table';
import { fetchWepon } from '../../Services/ApiServices';

const WeaponData = () => {
  const [searchSerialNumber, setSearchSerialNumber] = useState('');
  const [weaponData, setWeaponData] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const columns = [
    { name: "outTime", label: "Out Time" },
    { name: "inTime", label: "In Time" },
    { name: "conditionOnReturn", label: "Condition on Return" },
    { name: "signNCO", label: "Sign NCO" },
    { name: "signJCO", label: "Sign JCO" },
    { name: "signCO", label: "Sign CO" },
    { name: "purpose", label: "Purpose" },
  ];

  const options = {
    filterType: 'checkbox',
    responsive: 'standard',
    selectableRows: 'none',
    download: false,
    print: false,
    viewColumns: false,
    elevation: 0,
    textLabels: {
      body: {
        noMatch: "No records found",
      },
    },
    customToolbar: () => (
      <Typography variant="h6" sx={{ textAlign: 'left', padding: '1rem', fontWeight: 'bold', marginBottom: '1rem' }}>
        Weapon History
      </Typography>
    ),
  };

  const handleSearchSerialNumber = async () => {
    try {
      const response = await fetchWepon(searchSerialNumber);
      if (response.length === 0) {
        setErrorMessage('Weapon not found');
        setWeaponData(null);
      } else {
        setWeaponData(response[0]);
        setErrorMessage('');
      }
    } catch (error) {
      setErrorMessage(error.response && error.response.status === 404 ? 'Weapon not found' : 'An error occurred while fetching the data');
      setWeaponData(null);
    }
  };

  const formatIssuedTo = () => {
    if (weaponData.issuedTo.length === 0) return "No data";
    return weaponData.issuedTo.map(row => `${row.name} [ ${row.armyId}, ${row.rank} ]`).join(', ');
  };

  return (
    <Container
      maxWidth="md"
      sx={{
        backgroundColor: '#1c170ed2', // Dark background color
        color: '#e0e0e0', // Light text color for contrast
        padding: '2rem',
        borderRadius: '12px',
        boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(10px)'
      }}
    >
      <Typography variant="h5" gutterBottom sx={{ marginBottom: '2rem', textAlign: 'center', fontWeight: 'bold' }}>Search Weapon by Serial Number</Typography>
      <Grid container spacing={3} justifyContent="center">
        <Grid item xs={12} md={8}>
          <TextField
            fullWidth
            variant="outlined"
            value={searchSerialNumber}
            onChange={e => setSearchSerialNumber(e.target.value)}
            placeholder="Enter Serial Number"
            sx={{
              backgroundColor: 'rgba(255, 255, 255, 0.1)', // Transparent white background
              color: 'white', // Text color
              borderRadius: '20px',
              border: 'none',
              boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
              padding: '12px',
              transition: 'all 0.3s ease',
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  border: 'none',
                },
                '&.Mui-focused fieldset': {
                  border: 'none',
                },
              },
              '& .MuiInputBase-input': {
                color: 'white',
              },
            }}
          />
          <Button
            onClick={handleSearchSerialNumber}
            variant="contained"
            color="primary"
            sx={{
              marginTop: '1rem',
              backgroundColor: '#1f372f',
              borderRadius: '8px',
              boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.3)',
              '&:hover': {
                backgroundColor: '#1f372f',
                boxShadow: '0px 6px 12px rgba(0, 0, 0, 0.4)'
              }
            }}
          >
            Search
          </Button>
        </Grid>

        {errorMessage && (
          <Grid item xs={12}>
            <Typography variant="body1" sx={{ marginTop: '2rem', color: 'red', textAlign: 'center' }}>{errorMessage}</Typography>
          </Grid>
        )}

        {weaponData && (
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
              <Paper sx={{
                width: '100%',
                padding: '1rem',
                backgroundColor: '#2c2c2c', // Darker background for the Paper
                color: '#e0e0e0',
                borderRadius: '12px',
                boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.5)',
                backdropFilter: 'blur(10px)'
              }}>
                <Typography variant="h6" gutterBottom sx={{ textAlign: 'center', marginBottom: '1rem', fontWeight: 'bold', color: '#fff', backgroundColor: '#1a1a1a', padding: '0.5rem', borderRadius: '4px' }}>Weapon Information</Typography>
                <TableContainer component={Paper} sx={{ backgroundColor: '#2c2c2c', boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.5)' }}>
                  <Table size='medium' aria-label="weapon-data-table">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ color: '#e0e0e0', fontWeight: 'bold', textAlign: 'center', backgroundColor: '#1f372f' }}>Field</TableCell>
                        <TableCell sx={{ color: '#e0e0e0', fontWeight: 'bold', textAlign: 'center', backgroundColor: '#1f372f' }}>Value</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {[
                        { label: "Serial Number", value: weaponData.serialNumber },
                        { label: "Weapon Name", value: weaponData.weaponName },
                        { label: "Weapon Category", value: weaponData.weaponType },
                        { label: "Weapon Subcategory", value: weaponData.weaponSubType },
                        { label: "Weapon Status", value: weaponData.status },
                        { label: "Weapon Substatus", value: weaponData.subStatus },
                        { label: "Available Fire", value: weaponData.totalFire },
                        { label: "Type of Bullet", value: weaponData.typeOfBullet },
                        weaponData.issuedDate && { label: "Allotment Date", value: weaponData.issuedDate },
                        weaponData.returnDate && { label: "Return Date", value: weaponData.returnDate ? weaponData.returnDate : "Not Returned" },
                        { label: "Issued To", value: formatIssuedTo() }
                      ].filter(Boolean).map((row, index) => (
                        <TableRow
                          key={index}
                          sx={{
                            '&:nth-of-type(even)': { backgroundColor: '#2c2c2c' },
                            '&:nth-of-type(odd)': { backgroundColor: '#1e1e1e' },
                            '&:hover': { backgroundColor: '#3a3a3a' }, // Hover effect
                          }}
                        >
                          <TableCell sx={{ fontWeight: 'bold', color: '#e0e0e0', textAlign: 'left' }}>{row.label}</TableCell>
                          <TableCell sx={{ color: '#e0e0e0', textAlign: 'left' }}>{row.value}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Box>
          </Grid>
        )}

        {weaponData?.dailyIssued.length > 0 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
            <MUIDataTable
              data={weaponData.dailyIssued}
              columns={columns}
              options={options}
            />
          </Box>
        )}
      </Grid>
    </Container>
  );
};

export default WeaponData;
