import React from 'react';
import ActionCards from './ActionCards';
import { Container } from '@mui/material';

const WeaponEntry = () => {
  return (
    <Container 
      style={{ 
        marginTop: "70px",
        paddingTop: '20px', 
        paddingBottom: '20px', 
        backgroundColor: 'rgba(28, 23, 14, 0.824)', 
        color: '#fff', 
        borderRadius: '15px', 
        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.6)'
      }}
    >
      <ActionCards />
    </Container>
  );
};

export default WeaponEntry;
