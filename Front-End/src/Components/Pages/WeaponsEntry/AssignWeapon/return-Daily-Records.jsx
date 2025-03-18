import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Card, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useLocation } from 'react-router-dom';
import { returnDailyRecords, signVerify } from '../../../../Services/ApiServices';

const ReturnForm = () => {

  const location = useLocation();
  const rowData = location.state;
    console.log("rowData", rowData);

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    dailyIssuedId: rowData._id,
    serialNumber: rowData.serialNumber,
    weaponName: rowData.weaponName,
    weaponType: rowData.weaponType,
    weaponSubType: rowData.weaponSubType,
    usedBullet: rowData.usedBullet,
    purpose: rowData.purpose,
    conditionOnReturn : "Working",
    
    
  }) ;

  const [damageDetails , setDamageDetails] = useState({
    damageType: "",
    ReasonDamage: "",
    signNCO: { status: 'pending', signId: null },
    signJCO: { status: 'pending', signId: null },
    signCO: { status: 'pending', signId: null }
  });




  const [loginDetails, setLoginDetails] = useState([
    { officerUsername: '', password: '', role: 'NCO', approved: false },
    { officerUsername: '', password: '', role: 'JCO', approved: false },
    { officerUsername: '', password: '', role: 'CO', approved: false }
  ]);


  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDamageInputChange = (e) => {
    const { name, value } = e.target;
    setDamageDetails({ ...damageDetails, [name]: value });
  };

  const handleLoginInputChange = (e, index) => {
    const { name, value } = e.target;
    const newLoginDetails = [...loginDetails];
    newLoginDetails[index][name] = value;
    setLoginDetails(newLoginDetails);
  };

  const handleApprove = async (index) => {
    const { officerUsername, password, role } = loginDetails[index];

    try {
      const response = await signVerify(role, officerUsername, password);
      if (response) {
        console.log('response', response);
        setDamageDetails((prevData) => ({ ...prevData, [`sign${role}`]: response }));
        const updatedLoginDetails = [...loginDetails];
        updatedLoginDetails[index].approved = true;
        setLoginDetails(updatedLoginDetails);
        setSuccessMessage(`Approved ${loginDetails[index].role}`);
        setError('');
      } else {
        setError(`Incorrect username or password for ${loginDetails[index].role}`);
        setSuccessMessage('');
      }
    } catch (error) {

      if (error.response.status === 401) {
        setError(`Error verifying ${loginDetails[index].role}: officer not found`);
        setSuccessMessage('');
      } else if (error.response.status === 402) {
        setError(`Error verifying ${loginDetails[index].role}: not a valid room`);
        setSuccessMessage('');
      } else if (error.response.status === 403) {
        setError(`Error verifying ${loginDetails[index].role}: not a valid role`);
        setSuccessMessage('');
      } else if (error.response.status === 405) {
        setError(`Error verifying ${loginDetails[index].role}: not a valid password`);
        setSuccessMessage('');
      }
      
    }
  };




  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');
    setSuccessMessage('');

    console.log(formData);
    // console.log(loginDetails);

    try {
     
      const response = await returnDailyRecords({...formData, damageDetails: damageDetails});

      if (response) {
        console.log(response);
      


      // Mock success
      setSuccessMessage('Record added successfully');
      setError('');
      alert('Record added successfully');
       navigate("/weaponrecord");

      }
    } catch (error) {

      if (error) {
        setError(`Error adding record: ${error.response.data.message}`);
      }

      if (error.response.status === 406) {
        setError(`Weaponfire count is exceeded please set select maintenance`);
      }

      if (error.response.status === 405) {
        setError(`Weapon allready in inventory`);
      }

      if (error.response.status === 407) {
        setError(`weapon in workshop`);
      }

     
      setSuccessMessage('');
    }
  };

  return (
    <div style={{
      backgroundImage: 'url(https://source.unsplash.com/1600x900/?military)',
      backgroundSize: 'cover',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <Container className="p-4" style={{
        maxWidth: '900px',
        backgroundColor: '#1c170ed2',
        color: 'white',
        borderRadius: '10px',
        boxShadow: '0px 0px 15px rgba(0,0,0,0.5)'
      }}>
        <h2 className="my-4 text-center">Add Weapon Record</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        {successMessage && <Alert variant="success">{successMessage}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Col xs={12} md={6}>
              <Form.Group controlId="formSerialNo">
                <Form.Label>Serial No</Form.Label>
                <Form.Control
                  type="text"
                  name="serialNumber"
                  value={formData.serialNumber}
                  onChange={handleInputChange}
                  required
                  disabled
                  className="bg-dark text-light"
                />
              </Form.Group>
            </Col>

            <Col xs={12} md={6}>
              <Form.Group controlId="formWeaponName">
                <Form.Label>Weapon Name</Form.Label>
                <Form.Control
                  type="text"
                  name="weaponName"
                  value={formData.weaponName}
                  onChange={handleInputChange}
                  required
                  disabled
                  className="bg-dark text-light"
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col xs={12} md={6}>
              <Form.Group controlId="formWeaponCategory">
                <Form.Label>Weapon Category</Form.Label>
                <Form.Control
                  type="text"
                  name="weaponCategory"
                  value={formData.weaponType}
                  onChange={handleInputChange}
                  required
                  disabled
                  className="bg-dark text-light"
                />
              </Form.Group>
            </Col>

            <Col xs={12} md={6}>
              <Form.Group controlId="formWeaponSubCategory">
                <Form.Label>Weapon SubCategory</Form.Label>
                <Form.Control
                  type="text"
                  name="weaponSubCategory"
                  value={formData.weaponSubType}
                  onChange={handleInputChange}
                  required
                  disabled
                  className="bg-dark text-light"
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col xs={12} md={6}>
              <Form.Group controlId="formBulletsUsed">
                <Form.Label>Bullets Used</Form.Label>
                <Form.Control
                  type="number"
                  name="usedBullet"
                  value={formData.usedBullet}
                  onChange={handleInputChange}
                  required
                  className="bg-dark text-light"
                  disabled={formData.purpose === "Cleaning"}
                />
              </Form.Group>
            </Col>

            <Col xs={12} md={6}>
              <Form.Group controlId="formCondition">
                <Form.Label>Condition</Form.Label>
                <Form.Control
                  as="select"
                  name="conditionOnReturn"
                  value={formData.conditionOnReturn}
                  onChange={handleInputChange}
                  required
                  className="bg-dark text-light"
                >
                  <option value="Working">Working</option>
                  <option value="Damaged">Damaged</option>
                  <option value="Maintenance">Maintenance</option>
                </Form.Control>
              </Form.Group>
            </Col>
          </Row>

          {formData.conditionOnReturn === 'Damaged' && (
            <>
              <Row className="mb-3">
                <Col xs={12} md={6}>
                  <Form.Group controlId="formTypeOfDamage">
                    <Form.Label>Type of Damage</Form.Label>
                    <Form.Control
                      type="text"
                      name="damageType"
                      value={damageDetails.damageType}
                      onChange={handleDamageInputChange}
                      required
                      className="bg-dark text-light"
                    />
                  </Form.Group>
                </Col>

                <Col xs={12} md={6}>
                  <Form.Group controlId="formReasonOfDamage">
                    <Form.Label>Reason of Damage</Form.Label>
                    <Form.Control
                      type="text"
                      name="ReasonDamage"
                      value={damageDetails.ReasonDamage}
                      onChange={handleDamageInputChange}
                      required
                      className="bg-dark text-light"
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                {loginDetails.map((detail, index) => (
                  <Col xs={12} md={4} key={index}>
                    <Card className="mb-4 bg-secondary text-light" style={{ boxShadow: '0px 0px 10px rgba(0,0,0,0.3)' }}>
                      <Card.Body>
                        <Card.Title>{detail.role}</Card.Title>
                        {!detail.approved ? (
                          <Form>
                            <Form.Group controlId={`formOfficerUsername${index}`}>
                              <Form.Label>Username</Form.Label>
                              <Form.Control
                                type="text"
                                name="officerUsername"
                                value={detail.officerUsername}
                                onChange={(e) => handleLoginInputChange(e, index)}
                                required
                                className="bg-dark text-light"
                              />
                            </Form.Group>
                            <Form.Group controlId={`formPassword${index}`} className="mt-3">
                              <Form.Label>Password</Form.Label>
                              <Form.Control
                                type="password"
                                name="password"
                                value={detail.password}
                                onChange={(e) => handleLoginInputChange(e, index)}
                                required
                                className="bg-dark text-light"
                              />
                            </Form.Group>
                            <Button
                              variant="success"
                              onClick={() => handleApprove(index)}
                              className="mt-3 w-100"
                              style={{ backgroundColor: '#1F372F', borderColor: '#1F372F' }}
                            >
                              Approve
                            </Button>
                          </Form>
                        ) : (
                          <Alert variant="success">Approved</Alert>
                        )}
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </>
          )}

          <div className="mt-4 d-flex justify-content-between">
            <Link to="/weaponrecord">
              <Button variant="secondary" className="mr-2" style={{ backgroundColor: '#1F372F', borderColor: '#1F372F' }}>
                Back
              </Button>
            </Link>

            <Button type="submit" variant="primary" style={{ backgroundColor: '#1F372F', borderColor: '#1F372F' }}>
              Submit
            </Button>
          </div>
        </Form>
      </Container>
    </div>
  );
};

export default ReturnForm;
