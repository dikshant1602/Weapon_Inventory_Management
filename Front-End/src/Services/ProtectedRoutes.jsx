import React from 'react';
import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const ProtectedRoute = ({ element }) => {
  // Check if user is logged in
  const isLoggedIn = localStorage.getItem('logedAdmin');

  // Render element if logged in, otherwise redirect to home
  return isLoggedIn ? element : <Navigate to="/" />;
};

ProtectedRoute.propTypes = {
  element: PropTypes.element.isRequired,
};

export default ProtectedRoute;
