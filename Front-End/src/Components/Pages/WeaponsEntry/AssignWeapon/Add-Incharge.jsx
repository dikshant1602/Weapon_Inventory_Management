import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { addIncharge } from '../../../../Services/ApiServices';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Import the eye icons

const AddRoomIncharge = ({ setShowModal1 }) => {
  const navigate = useNavigate();
  const [roomNo, setRoomNo] = useState('');
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!roomNo || !userName || !password) {
      setError('All fields are required!');
      return;
    }

    try {
      const response = await addIncharge(userName, roomNo, password);
      setSuccess("Incharge added successfully");
      setError(''); // Clear any previous errors
      setRoomNo('');
      setUserName('');
      setPassword('');
    } catch (error) {
      setError(error.response?.data?.message || 'An error occurred');
      setSuccess(''); // Clear any previous success messages
    }
  };

  const handleClose = () => {
    setShowModal1(false);
  };

  return (
    <Container
      className="p-4 mt-5"
      style={{
        maxWidth: '700px',
        backgroundColor: '#1c170ed2', // Container background color
        color: 'white', // Text color to white
        borderRadius: '10px',
        boxShadow: '0px 0px 15px 5px rgba(255, 255, 255, 0.7)', // White glowing shadow
        position: 'relative', // For positioning the close button
      }}
    >
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
          <h2 className="text-center mb-4">Add Room Incharge</h2>
          {error && (
            <Alert
              variant="danger"
              style={{
                backgroundColor: '#f8d7da', // Background color for error
                color: '#721c24', // Text color for error
                borderColor: '#f5c6cb', // Border color for error
                borderRadius: '5px',
              }}
            >
              {error}
            </Alert>
          )}
          {success && (
            <Alert
              variant="success"
              style={{
                backgroundColor: '#d4edda', // Background color for success
                color: '#155724', // Text color for success
                borderColor: '#c3e6cb', // Border color for success
                borderRadius: '5px',
              }}
            >
              {success}
            </Alert>
          )}
          <Form onSubmit={handleSubmit}>
            <Form.Group as={Row} controlId="formRoomNo" className="mb-3">
              <Form.Label column sm="3">Room No:</Form.Label>
              <Col sm="9">
                <Form.Control
                  type="text"
                  placeholder="Enter room number"
                  value={roomNo}
                  onChange={(e) => setRoomNo(e.target.value)}
                  required
                  style={{ backgroundColor: '#ffffff', color: 'black', border: 'none', borderRadius: '5px' }}
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row} controlId="formUserName" className="mb-3">
              <Form.Label column sm="3">User Name:</Form.Label>
              <Col sm="9">
                <Form.Control
                  type="text"
                  placeholder="Enter user name"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  required
                  style={{ backgroundColor: '#ffffff', color: 'black', border: 'none', borderRadius: '5px' }}
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row} controlId="formPassword" className="mb-3">
              <Form.Label column sm="3">Password:</Form.Label>
              <Col sm="9">
                <div className="position-relative">
                  <Form.Control
                    type={showPassword ? 'text' : 'password'} // Toggle input type based on state
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={{ backgroundColor: '#ffffff', color: 'black', border: 'none', borderRadius: '5px' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      top: '50%',
                      right: '10px',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: 'white',
                    }}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />} {/* Toggle icon based on state */}
                  </button>
                </div>
              </Col>
            </Form.Group>

            <div className="d-flex justify-content-between">
              <Button
                variant="primary"
                type="submit"
                className="mt-4"
                style={{ width: '100%', backgroundColor: '#1f372f', border: 'none', borderRadius: '5px' }}
              >
                Add
              </Button>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default AddRoomIncharge;
