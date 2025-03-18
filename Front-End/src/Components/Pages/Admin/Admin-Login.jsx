import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css'; // Import Font Awesome
import { login } from '../../../Services/ApiServices';
import { useNavigate } from 'react-router-dom';
import logo from '/logo.png'; // Update path as needed

const AdminLogin = () => {
  const [roomNoAssigned, setRoomNoAssigned] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // State for password visibility
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await login(roomNoAssigned, password);
      const { logedAdmin, accessToken, refreshToken } = response;
      console.log(response);

      if (logedAdmin) {
        localStorage.clear();
        localStorage.setItem('logedAdmin', JSON.stringify(logedAdmin));
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);

        if (logedAdmin.isSuperAdmin) {
          navigate('/superadmin'); // Use navigate for redirection
        } else {
          navigate('/admindashboard'); // Use navigate for redirection
        }
      } else {
        setError('Error determining admin role. Please try again.');
      }
    } catch (err) {
      console.error('Axios error:', err);
      setError('Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="admin-login-container vh-100 d-flex justify-content-center align-items-center">
      <div className="card text-light shadow-lg border-0 rounded-lg" style={{
        maxWidth: '500px', width: '100%', backgroundColor: 'rgba(28, 22, 12, 0.4)', // Darker shade for card
        borderRadius: '20px', border: '1px solid rgba(31, 55, 47, 0.5)', backdropFilter: 'blur(10px)', // Glass effect
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)', transition: 'all 0.3s ease'
      }}>
        <div className="card-header text-center py-4">
          <img src={logo} alt="Logo" style={{ width: '150px', height: '150px', borderRadius: '50%', boxShadow: '0 0 15px rgba(31, 55, 47, 0.7)', marginBottom: '10px' }} />
          <h4 className="mb-0" style={{ color: '#fff', fontWeight: 'bold' }}>Weapon Management System</h4>
        </div>
        <div className="card-body px-4 py-5">
          <form onSubmit={handleSubmit}>
            <div className="form-group mb-4">
              <label htmlFor="roomNoAssigned" className="form-label" style={{ color: 'white' }}>Room No Assigned</label>
              <input
                type="text"
                className="form-control"
                id="roomNoAssigned"
                placeholder='Enter Room or Super Admin'
                value={roomNoAssigned}
                onChange={(e) => setRoomNoAssigned(e.target.value)}
                required
              />
            </div>
            <div className="form-group mb-4 position-relative">
              <label htmlFor="password" className="form-label" style={{ color: 'white' }}>Password</label>
              <div className="d-flex align-items-center">
                <input
                  type={showPassword ? "text" : "password"} // Toggle input type
                  className="form-control"
                  id="password"
                  placeholder='Enter Password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <span
                  style={{
                    position: 'absolute', right: '15px', cursor: 'pointer', fontSize: '18px'
                  }}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`} style={{ color: 'white' }}></i>
                </span>
              </div>
            </div>
            <div className="text-center">
              <button type="submit" className="btn btn-primary mt-4" style={{
                width: '60%', backgroundColor: '#1F372F', borderColor: '#1F372F', borderRadius: '20px',
                padding: '12px', boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)', transition: 'all 0.3s ease'
              }}
                onMouseEnter={(e) => e.target.style.boxShadow = '0 0 14px rgba(255, 255, 255, 0.6)'}
                onMouseLeave={(e) => e.target.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.3)'}
              >
                Login
              </button>
            </div>
            {error && <p className="text-danger mt-3 text-center">{error}</p>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
