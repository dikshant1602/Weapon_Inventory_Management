import React from 'react';
import './Header.css';

const Header = ({ username }) => {
  return (
    <header className="header bg-dark text-white d-flex justify-content-between align-items-center">
      <div className="header-username">
        Welcome, {username}
      </div>
      <div className="header-buttons">
        <button className="btn btn-sm btn-primary mr-2">Change Password</button>
        <button className="btn btn-sm btn-danger">Logout</button>
      </div>
    </header>
  );
};

export default Header;
