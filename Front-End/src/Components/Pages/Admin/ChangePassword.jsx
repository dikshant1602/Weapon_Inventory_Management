import React, { useState } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import '@fortawesome/fontawesome-free/css/all.min.css'; // Import Font Awesome
import { changePassword } from '../../../Services/ApiServices';

const ChangePassword = ({ roomNo, setShowModal }) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false); // State for new password visibility
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // State for confirm password visibility
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match!');
    } else {
      try {
        await changePassword(roomNo, newPassword);
        setError("Password changed successfully");
      } catch (error) {
        setError(error.response.data.message);
      }
    }
  };

  const handleClose = () => {
    setShowModal(false);
  };

  return (
    <Container className="p-4 mt-5" style={{ 
      maxWidth: '700px', 
      backgroundColor: '#1c170ed2', // Updated container background color
      color: 'white', // Updated text color to white
      borderRadius: '10px', 
      boxShadow: '0px 0px 15px 5px rgba(255, 255, 255, 0.7)' // White glow shadow
    }}>
      <div style={{ position: 'relative' }}>
        <button
          onClick={handleClose}
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            background: 'none',
            border: 'none',
            color: 'white',
            fontSize: '24px',
            cursor: 'pointer',
            zIndex: '10', // Ensure it is on top of other elements
          }}
        >
          ×
        </button>
        <Row className="justify-content-md-center">
          <Col md="12">
            <h2 className="text-center mb-4">Change Password for Room {roomNo}</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <Form onSubmit={handleSubmit}>
              <Form.Group as={Row} controlId="formNewPassword" className="mb-3 position-relative">
                <Form.Label column sm="3">New Password:</Form.Label>
                <Col sm="9" className="d-flex align-items-center">
                  <Form.Control 
                    type={showNewPassword ? "text" : "password"} 
                    placeholder="Enter new password" 
                    value={newPassword} 
                    onChange={(e) => setNewPassword(e.target.value)} 
                    required 
                    style={{ backgroundColor: '#555', color: 'white', border: 'none', borderRadius: '5px' }}
                  />
                  <span
                    style={{
                      position: 'absolute', right: '15px', cursor: 'pointer'
                    }}
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    <i className={`fas ${showNewPassword ? 'fa-eye-slash' : 'fa-eye'}`} style={{ color: 'white' }}></i>
                  </span>
                </Col>
              </Form.Group>

              <Form.Group as={Row} controlId="formConfirmPassword" className="mb-3 position-relative">
                <Form.Label column sm="3">Confirm Password:</Form.Label>
                <Col sm="9" className="d-flex align-items-center">
                  <Form.Control 
                    type={showConfirmPassword ? "text" : "password"} 
                    placeholder="Confirm new password" 
                    value={confirmPassword} 
                    onChange={(e) => setConfirmPassword(e.target.value)} 
                    required 
                    style={{ backgroundColor: '#555', color: 'white', border: 'none', borderRadius: '5px' }}
                  />
                  <span
                    style={{
                      position: 'absolute', right: '15px', cursor: 'pointer'
                    }}
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    <i className={`fas ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'}`} style={{ color: 'white' }}></i>
                  </span>
                </Col>
              </Form.Group>

              <div className="d-flex justify-content-end">
                <Button variant="primary" type="submit" className="mt-4" style={{ width: '100%', backgroundColor: '#1f372f', border: 'none', borderRadius: '5px' }}>
                  Change Password
                </Button>
              </div>
            </Form>
          </Col>
        </Row>
      </div>
    </Container>
  );
};

export default ChangePassword;
