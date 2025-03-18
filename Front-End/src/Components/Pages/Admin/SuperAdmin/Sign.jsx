import React, { useEffect, useState } from 'react';
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { addIncharge, changePasswordSign, createverification, getRooms, repleceOfficer } from '../../../../Services/ApiServices';
import IdCard from './IdCard';
import '@fortawesome/fontawesome-free/css/all.min.css'; // Import Font Awesome

const Sign = ({ setShowModal2 }) => {
  const navigate = useNavigate();
  const [roomNo, setRoomNo] = useState('');
  const [role, setRole] = useState('');
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [rePassword, setRePassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // State for password visibility
  const [showRePassword, setShowRePassword] = useState(false); // State for re-enter password visibility
  const [error, setError] = useState('');
  const [action, setAction] = useState('');
  const [room, setRoom] = useState([]);
  const [resData, setResData] = useState({});

  useEffect(() => {
    (async () => {
      try {
        const response = await getRooms();
        setRoom(response);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (action === 'add' && (!userName || !password)) {
      setError('All fields are required!');
      return;
    } else if (action === 'reset' && (!password || !rePassword)) {
      setError('All fields are required!');
      return;
    } else if (action === 'replace' && (!userName || !password)) {
      setError('All fields are required!');
      return;
    }

    try {
      if (action === 'add') {
        if (!userName || !roomNo || !role || !password) {
          setError('All fields are required!');
          return;
        }
        try {
          const response = await createverification(userName, roomNo, role, password);
          setResData(response);
          setError('Incharge added successfully');
        } catch (error) {
          if (error.response.status === 401) {
            setError('The sign already exists');
          }
        }
      } else if (action === 'reset') {
        if (!roomNo || !role || !password) {
          setError('All fields are required!');
          return;
        }
        if (password !== rePassword) {
          setError('Passwords do not match');
          return;
        }
        try {
          const response = await changePasswordSign(roomNo, role, password);
          setResData(response);
          console.log(response);
          setError('Password reset successfully');

        } catch (error) {
          if (error.response.status === 401) {
            setError('The sign does not exist');
          }
        }
      } else if (action === 'replace') {
        if (!userName || !roomNo || !role || !password) {
          setError('All fields are required!');
          return;
        }
        try {
          const response = await repleceOfficer(userName, roomNo, role, password);
          setResData(response);
          setError('Incharge replaced successfully');
        } catch (error) {
          if (error.response.status === 401) {
            setError('The sign does not exist');
          }
        }
      }
      setRoomNo('');
      setRole('');
      setUserName('');
      setPassword('');
      setRePassword('');
    } catch (error) {
      setError(error.response.data.message);
    }
  };

  const handleBack = () => {
    setShowModal2(false);
  };

  return (
    <Container
      className="mt-5 p-5 position-relative"
      style={{
        backgroundColor: '#1c170ed2',
        color: 'white',
        borderRadius: '10px',
        boxShadow: '0px 0px 15px 5px rgba(255, 255, 255, 0.7)', // White glowing shadow
      }}
    >
      <button
        onClick={handleBack}
        style={closeButtonStyle}
      >
        ×
      </button>
      <Row style={{ display: 'flex', flexDirection: 'row' }}>
        {/* Form Column */}
        <Col md={8} style={{ paddingRight: '20px' }}>
          <h2 className="text-center mb-4">Manage Room Incharge</h2>
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
          <Form onSubmit={handleSubmit}>
            <Form.Group as={Row} controlId="formRoomNo" className="mb-3">
              <Form.Label column sm="3">Room No:</Form.Label>
              <Col sm="9">
                <Form.Control
                  as="select"
                  value={roomNo}
                  onChange={(e) => setRoomNo(e.target.value)}
                  required
                  style={{ backgroundColor: '#ffffff', color: 'black', border: 'none', borderRadius: '5px' }}
                >
                  <option value="">Select Room No</option>
                  {room.map((room1) => (
                    <option key={room1} value={room1}>{room1}</option>
                  ))}
                </Form.Control>
              </Col>
            </Form.Group>

            <Form.Group as={Row} controlId="formRole" className="mb-3">
              <Form.Label column sm="3">Role:</Form.Label>
              <Col sm="9">
                <Form.Control
                  as="select"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  required
                  style={{ backgroundColor: '#ffffff', color: 'black', border: 'none', borderRadius: '5px' }}
                >
                  <option value="">Select Role</option>
                  <option value="NCO">Kote NCO</option>
                  <option value="JCO">Kote JCO</option>
                  <option value="CO">Commanding Officer</option>
                </Form.Control>
              </Col>
            </Form.Group>

            <div className="button-container" style={{
              backgroundColor: '#1f372f', // Same color as main container
              boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.5)', // Dark shadow
              padding: '10px',
              borderRadius: '10px',
              marginBottom: '20px'
            }}>
              <div className="d-flex justify-content-around mt-4 mb-4">
                <Button
                  variant="secondary"
                  onClick={() => setAction('add')}
                  style={{ backgroundColor: '#1c170ed2', border: 'none', borderRadius: '5px' }}
                >
                  Add New Sign
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => setAction('reset')}
                  style={{ backgroundColor: '#1c170ed2', border: 'none', borderRadius: '5px' }}
                >
                  Reset Password
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => setAction('replace')}
                  style={{ backgroundColor: '#1c170ed2', border: 'none', borderRadius: '5px' }}
                >
                  Replace Officer
                </Button>
              </div>
            </div>

            {action === 'add' && (
              <>
                <Form.Group as={Row} controlId="formUserName" className="mb-3">
                  <Form.Label column sm="3">Name:</Form.Label>
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

                <Form.Group as={Row} controlId="formPassword" className="mb-3 position-relative">
                  <Form.Label column sm="3">Password:</Form.Label>
                  <Col sm="9" className="d-flex align-items-center">
                    <Form.Control
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      style={{ backgroundColor: '#ffffff', color: 'black', border: 'none', borderRadius: '5px' }}
                    />
                    <i
                      className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"} ms-2`}
                      onClick={() => setShowPassword(!showPassword)}
                      style={{ cursor: 'pointer', color: 'white' }}
                    />
                  </Col>
                </Form.Group>
              </>
            )}

            {action === 'reset' && (
              <>
                <Form.Group as={Row} controlId="formNewPassword" className="mb-3 position-relative">
                  <Form.Label column sm="3">New Password:</Form.Label>
                  <Col sm="9" className="d-flex align-items-center">
                    <Form.Control
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter new password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      style={{ backgroundColor: '#ffffff', color: 'black', border: 'none', borderRadius: '5px' }}
                    />
                    <i
                      className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"} ms-2`}
                      onClick={() => setShowPassword(!showPassword)}
                      style={{ cursor: 'pointer', color: 'white' }}
                    />
                  </Col>
                </Form.Group>
                <Form.Group as={Row} controlId="formRePassword" className="mb-3 position-relative">
                  <Form.Label column sm="3">Re-enter Password:</Form.Label>
                  <Col sm="9" className="d-flex align-items-center">
                    <Form.Control
                      type={showRePassword ? "text" : "password"}
                      placeholder="Re-enter password"
                      value={rePassword}
                      onChange={(e) => setRePassword(e.target.value)}
                      required
                      style={{ backgroundColor: '#ffffff', color: 'black', border: 'none', borderRadius: '5px' }}
                    />
                    <i
                      className={`fas ${showRePassword ? "fa-eye-slash" : "fa-eye"} ms-2`}
                      onClick={() => setShowRePassword(!showRePassword)}
                      style={{ cursor: 'pointer', color: 'white' }}
                    />
                  </Col>
                </Form.Group>
              </>
            )}

            {action === 'replace' && (
              <>
                <Form.Group as={Row} controlId="formUserName" className="mb-3">
                  <Form.Label column sm="3">Name:</Form.Label>
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

                <Form.Group as={Row} controlId="formPassword" className="mb-3 position-relative">
                  <Form.Label column sm="3">Password:</Form.Label>
                  <Col sm="9" className="d-flex align-items-center">
                    <Form.Control
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      style={{ backgroundColor: '#ffffff', color: 'black', border: 'none', borderRadius: '5px' }}
                    />
                    <i
                      className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"} ms-2`}
                      onClick={() => setShowPassword(!showPassword)}
                      style={{ cursor: 'pointer', color: 'white' }}
                    />
                  </Col>
                </Form.Group>
              </>
            )}

            <Button
              type="submit"
              style={{ backgroundColor: '#1f372f', border: 'none', borderRadius: '5px' }}
            >
              Submit
            </Button>
          </Form>
        </Col>

        {/* ID Card Column */}
        <Col md={4}>
      {/* //name, room, role, userName, password */}
          <IdCard name={resData.officerName} room={resData.forRoom} role={resData.role} userName={resData.officerUsername} password={resData.plainPassword}   />
        </Col>
      </Row>
    </Container>
  );
};

// Custom button styles
const closeButtonStyle = {
  position: 'absolute',
  top: '10px',
  right: '10px',
  background: 'none',
  border: 'none',
  color: 'white',
  fontSize: '24px',
  cursor: 'pointer',
};

export default Sign;
