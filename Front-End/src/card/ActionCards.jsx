import React from 'react';
import { Card, CardContent, Typography, Grid } from '@mui/material';
import { styled } from '@mui/system';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolderPlus, faFolderOpen, faBullseye, faCrosshairs, faGun } from '@fortawesome/free-solid-svg-icons';

const actions = [
  { title: 'Add Category', description: 'Create a new category.', link: '/addcategory' },
  { title: 'Add Subcategory', description: 'Create a new subcategory.', link: '/addsubcategory' },
  { title: 'Add Bullet Details', description: 'Add details for bullets.', link: '/addBullet' },
  { title: 'Add Weapon Details', description: 'Add details for weapons.', link: '/addweapon' },
  { title: 'Add Weapon', description: 'Add a new weapon in Inventory.', link: '/addweapondetail' },
];

const StyledCard = styled(Card)(({ theme }) => ({
  backgroundColor: '#1f372f',
  color: '#fff',
  margin: '20px',
  maxWidth: '300px',
  borderRadius: '10px',
  boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)',
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  '&:hover': {
    transform: 'scale(1.05)',
    boxShadow: '0 0 20px rgba(255, 255, 255, 0.7)', // White glow effect
  },
}));

const ActionCard = ({ title, description, link }) => {
  let IconComponent;

  switch (title) {
    case 'Add Category':
      IconComponent = faFolderPlus;
      break;
    case 'Add Subcategory':
      IconComponent = faFolderOpen;
      break;
    case 'Add Bullet Details':
      IconComponent = faBullseye;
      break;
    case 'Add Weapon Details':
      IconComponent = faCrosshairs;
      break;
    case 'Add Weapon':
      IconComponent = faGun;
      break;
    default:
      IconComponent = faFolderPlus; // Default icon
  }

  return (
    <Link to={link} style={{ textDecoration: 'none' }}>
      <StyledCard>
        <CardContent>
          <Typography variant="h5" component="div">
            <FontAwesomeIcon icon={IconComponent} style={{ marginRight: '10px' }} />
            {title}
          </Typography>
          <Typography variant="body2" color="inherit">
            {description}
          </Typography>
        </CardContent>
      </StyledCard>
    </Link>
  );
};

const ActionCards = () => {
  return (
    <Grid container spacing={3} justifyContent="center">
      {actions.map((action, index) => (
        <Grid item xs={12} sm={6} md={4} key={index}>
          <ActionCard title={action.title} description={action.description} link={action.link} />
        </Grid>
      ))}
    </Grid>
  );
};

export default ActionCards;
