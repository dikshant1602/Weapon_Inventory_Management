
import React from 'react';
import {
  Card,
  CardActions,
  CardContent,
  Button,
  Typography,
  Grid,
  Container,
  Box,
  createTheme,
  ThemeProvider,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusSquare, faArrowAltCircleLeft } from '@fortawesome/free-solid-svg-icons';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#1f372f', // Adjusted primary color
    },
    secondary: {
      main: '#1f372f', // Adjusted secondary color
    },
  },
});

const cardStyle = {
  borderRadius: '12px',
  boxShadow: '0px 4px 8px rgba(0,0,0,0.3)',
  backgroundColor: '#1c170ed2',
  color: 'white',
  minHeight: '350px', // Minimum height for larger cards
  width: '100%', // Ensure cards take full width of the grid item
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center', // Center content vertically
  alignItems: 'center', // Center content horizontally
};

const cardContentStyle = {
  padding: '16px', // Reduced padding inside the card
  textAlign: 'center', // Center-align text inside the card
};

const cardActionsStyle = {
  padding: '12px', // Adjusted padding for card actions
  justifyContent: 'center', // Center button inside card actions
};

const buttonStyle = {
  borderRadius: '20px',
  boxShadow: '0px 3px 6px rgba(0,0,0,0.2)',
  fontWeight: 'bold',
  padding: '16px 32px', // Increased padding for a larger button
  fontSize: '18px', // Increased font size
  marginTop: '16px', // Margin to separate button from text
};

function WeaponsEntry() {
  return (
    <ThemeProvider theme={darkTheme}>
      <Container maxWidth="sm"> {/* Adjusted maxWidth for a more focused layout */}
        <Box my={4}>
          <Typography variant="h4" component="h1" gutterBottom align="center" color="white">
            Allot / Return Weapons
          </Typography>
          <Grid container spacing={4} direction="column" alignItems="center"> {/* Stack cards vertically */}
            {/* Assign Weapon Card */}
            <Grid item xs={12} style={{ width: '100%', maxWidth: '600px' }}>
              <Card sx={cardStyle}>
                <CardContent sx={cardContentStyle}>
                  <FontAwesomeIcon icon={faPlusSquare} size="3x" style={{ marginBottom: '16px' }} />
                  <Typography variant="h5" component="h2" gutterBottom fontSize="24px">
                    Allot a Weapon
                  </Typography>
                  <Typography color="textSecondary" gutterBottom fontSize="18px">
                    Click below to allot a weapon:
                  </Typography>
                </CardContent>
                <CardActions sx={cardActionsStyle}>
                  <Button
                    variant="contained"
                    color="primary"
                    component={Link}
                    to="/assignweapon"
                    sx={buttonStyle}
                  >
                    Allot Weapon
                  </Button>
                </CardActions>
              </Card>
            </Grid>

            {/* Return Weapon Card */}
            <Grid item xs={12} style={{ width: '100%', maxWidth: '600px' }}>
              <Card sx={cardStyle}>
                <CardContent sx={cardContentStyle}>
                  <FontAwesomeIcon icon={faArrowAltCircleLeft} size="3x" style={{ marginBottom: '16px' }} />
                  <Typography variant="h5" component="h2" gutterBottom fontSize="24px">
                    Return Weapon
                  </Typography>
                  <Typography color="textSecondary" gutterBottom fontSize="18px">
                    Click below to return a weapon:
                  </Typography>
                </CardContent>
                <CardActions sx={cardActionsStyle}>
                  <Button
                    variant="contained"
                    color="secondary"
                    component={Link}
                    to="/returnweapon"
                    sx={buttonStyle}
                  >
                    Return Weapon
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default WeaponsEntry;
