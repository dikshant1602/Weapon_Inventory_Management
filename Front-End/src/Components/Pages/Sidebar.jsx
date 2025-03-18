import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BsList, BsX } from 'react-icons/bs';
import { FaTachometerAlt, FaClipboardList, FaSearch, FaPlus, FaExchangeAlt, FaUserCog } from 'react-icons/fa';
import './Sidebar.css'; // Import your CSS file

const Sidebar = () => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [isSuperAdmin, setSuperAdmin] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [username, setUsername] = useState('');
  const navigate = useNavigate(); // Use navigate for redirection

  useEffect(() => {
    // Fetch username and role from localStorage
    const loggedAdmin = JSON.parse(localStorage.getItem('logedAdmin'));
    if (loggedAdmin) {
      setUsername(loggedAdmin.adminName);
      setSuperAdmin(loggedAdmin.isSuperAdmin); // Adjust as needed
    }
  }, []);

  const toggleDropdown = (menu) => {
    setOpenDropdown(openDropdown === menu ? null : menu);
  };

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const handleLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem('logedAdmin');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');

    // Clear cookies
    document.cookie.split(";").forEach((cookie) => {
      const cookieName = cookie.split("=")[0].trim();
      document.cookie = `${cookieName}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
    });

    // Redirect to login page
    navigate('/');
  };

  const handleLinkClick = () => {
    setSidebarOpen(false);
    setOpenDropdown(null);
  };

  return (
    <div>
      <button
        onClick={toggleSidebar}
        className="sidebar-toggler"
      >
        {sidebarOpen ? <BsX /> : <BsList />}
      </button>
      <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <ul className="nav flex-column">
          {!isSuperAdmin && (
            <>
              <li className="nav-item mb-2">
                <NavLink to="/admindashboard" end className="nav-link" activeClassName="active" onClick={handleLinkClick}>
                  <FaTachometerAlt className="mr-2 icon" /> Dashboard
                </NavLink>
              </li>
              <li className="nav-item mb-2">
                <NavLink to="/records" end className="nav-link" activeClassName="active" onClick={handleLinkClick}>
                  <FaClipboardList className="mr-2 icon" /> Records
                </NavLink>
              </li>
              <li className="nav-item mb-2">
                <NavLink to="/weapondata" end className="nav-link" activeClassName="active" onClick={handleLinkClick}>
                  <FaSearch className="mr-2 icon" /> Fetch Weapon Details
                </NavLink>
              </li>
              <li className="nav-item mb-2">
                <NavLink to="/weaponentry" end className="nav-link" activeClassName="active" onClick={handleLinkClick}>
                  <FaPlus className="mr-2 icon" /> Weapons Entry
                </NavLink>
              </li>
              <li className="nav-item mb-2">
                <NavLink to="/allotweapon" end className="nav-link" activeClassName="active" onClick={handleLinkClick}>
                  <FaExchangeAlt className="mr-2 icon" /> Allot / Return Weapon
                </NavLink>
              </li>
            </>
          )}
          {isSuperAdmin && (
            <li className="nav-item mb-2">
              <NavLink to="/superAdmin" end className="nav-link" activeClassName="active" onClick={handleLinkClick}>
                <FaUserCog className="mr-2 icon" /> Super Admin
              </NavLink>
            </li>
          )}
        </ul>
        <div className="sidebar-footer mt-auto centered">
          <p>{username || 'User'}</p>
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>
      </div>
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={toggleSidebar}
        />
      )}
    </div>
  );
};

export default Sidebar;
