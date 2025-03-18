import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Card, Alert } from 'react-bootstrap';
import { Link  , useNavigate} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { addDailyRecord, fetchIssuedWeapon, signVerify } from '../../../../Services/ApiServices';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';


const AddDailyRecords = () => {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    
    serialNumber: '',
    weaponName: '',
    weaponType: '',
    weaponSubType: '',
    issuedTo: [],
    purpose: '',
    signNCO: { status: 'pending', signId: null },
    signJCO: { status: 'pending', signId: null },
    signCO: { status: 'pending', signId: null }
  });

  const [isDataFetched, setIsDataFetched] = useState(false);
  const [loginDetails, setLoginDetails] = useState([
    { officerUsername: '', password: '', role: 'NCO', approved: false },
    { officerUsername: '', password: '', role: 'JCO', approved: false },
    { officerUsername: '', password: '', role: 'CO', approved: false }
  ]);

  const purposes = ['Cleaning', 'Training', 'Firing', 'Out of Station'];

  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleCadetInputChange = (e, index) => {
    const { name, value } = e.target;
    const updatedIssuedTo = [...formData.issuedTo];
    updatedIssuedTo[index][name] = value;
    setFormData({ ...formData, issuedTo: updatedIssuedTo });
  };

  const handleVerifyId = (index) => {
    const { issuedTo } = formData;
    const updatedIssuedTo = [...issuedTo];
    const cadet = updatedIssuedTo[index];

    if (cadet.armyId === cadet.armyId1.trim()) {
      cadet.verified = true;
      setSuccessMessage(`ID ${cadet.armyId1} for ${cadet.name} is verified.`);
      setError('');
    } else {
      cadet.verified = false;
      setError(`ID ${cadet.armyId1} for ${cadet.name} is not verified.`);
      setSuccessMessage('');
    }

    updatedIssuedTo[index] = cadet;
    setFormData({ ...formData, issuedTo: updatedIssuedTo });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSerialNoChange = (e) => {
    const serialNumber = e.target.value;
    setFormData({ ...formData, serialNumber });
  };

  const handleFetchData = async () => {
    const { serialNumber } = formData;

    try {
      const response = await fetchIssuedWeapon(serialNumber);
      setIsDataFetched(true);
      setFormData(response);
      console.log(formData);
    } catch (error) {
      console.log(error);
      if (error.response.status === 401) {
        setError('Weapon not found');
        setSuccessMessage('');
      } else if (error.response.status === 403) {
        setError('Weapon is not issued');
        setSuccessMessage('');
      } else if (error.response.status === 405) {
        setError('Weapon is not in inventory status');
        setSuccessMessage('');
      }
     
    }
  };

  const handleLoginInputChange = (e, index) => {
    const { name, value } = e.target;
    const updatedLoginDetails = [...loginDetails];
    updatedLoginDetails[index][name] = value;
    setLoginDetails(updatedLoginDetails);
  };

  const handleApprove = async (index) => {
    const { officerUsername, password, role } = loginDetails[index];

    try {
      const response = await signVerify(role, officerUsername, password);
      if (response) {
        console.log('response', response);
        setFormData((prevData) => ({ ...prevData, [`sign${role}`]: response }));
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

    try {
      const response = await addDailyRecord(formData);
      if (response) {
        setSuccessMessage('Record added successfully');     
        setError('');
        alert('Record added successfully');
        navigate("/weaponrecord");

      }
    } catch (error) {
      console.log(error);
      if (error.response.status === 401) {
        setError('Error adding record: officer not found');
        setSuccessMessage('');
      }
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
        <h2 className="my-4 text-center">Add Weapon Daily Records</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        {successMessage && <Alert variant="success">{successMessage}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Col xs={12} md={6}>
              <Form.Group controlId="formSerialNo">
                <Form.Label>Serial No</Form.Label>
                <div className="d-flex align-items-center">
                  <Form.Control
                    type="text"
                    name="serialNumber"
                    value={formData.serialNumber}
                    onChange={handleSerialNoChange}
                    required
                    disabled={isDataFetched}
                    className="bg-dark text-light"
                  />
                  <Button variant="primary" onClick={handleFetchData} className="ml-2" style={{ marginLeft: '10px' , background: '#1f372f', border: 'none'}}>
                    Fetch
                  </Button>
                </div>
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
                  disabled={isDataFetched}
                  className="bg-dark text-light"
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col xs={12} md={6}>
              <Form.Group controlId="formCategory">
                <Form.Label>Category</Form.Label>
                <Form.Control
                  type="text"
                  name="weaponType"
                  value={formData.weaponType}
                  onChange={handleInputChange}
                  required
                  disabled={isDataFetched}
                  className="bg-dark text-light"
                />
              </Form.Group>
            </Col>

            <Col xs={12} md={6}>
              <Form.Group controlId="formSubCategory">
                <Form.Label>Sub Category</Form.Label>
                <Form.Control
                  type="text"
                  name="weaponSubType"
                  value={formData.weaponSubType}
                  onChange={handleInputChange}
                  required
                  disabled={isDataFetched}
                  className="bg-dark text-light"
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col xs={12} md={12}>
              <Form.Group controlId="formPurpose">
                <Form.Label>Purpose</Form.Label>
                <Form.Control
                  as="select"
                  name="purpose"
                  value={formData.purpose}
                  onChange={handleInputChange}
                  required
                  className="bg-dark text-light"
                >
                  <option value="" disabled>Select Purpose</option>
                  {purposes.map((purpose, index) => (
                    <option key={index} value={purpose}>{purpose}</option>
                  ))}
                </Form.Control>
              </Form.Group>
            </Col>
          </Row>

          <h3 className="my-4">Soldier Info</h3>

          {formData.purpose !== 'Cleaning' && formData.issuedTo.map((cadet, index) => (
            <Row className="mb-3" key={index}>
              <Col xs={12} md={6}>
                <Form.Group controlId={`formCadetName${index}`}>
                  <Form.Label>Soldier Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={cadet.name}
                    required
                    disabled
                    className="bg-dark text-light"
                  />
                </Form.Group>
              </Col>

              <Col xs={12} md={6}>
                <Form.Group controlId={`formCadetId${index}`}>
                  <Form.Label>Army Id</Form.Label>
                  <div className="d-flex">
                    <Form.Control
                      type="text"
                      name="armyId1"
                      value={cadet.armyId1}
                      onChange={(e) => handleCadetInputChange(e, index)}
                      required
                      className="bg-dark text-light"
                      disabled={cadet.verified}
                    />
                    <Button variant="secondary" onClick={() => handleVerifyId(index)} className="ml-2" disabled={cadet.verified} style={{ marginLeft: '10px' }}>
                      {cadet.verified ? 'Verified' : 'Verify'}
                    </Button>
                  </div>
                </Form.Group>
              </Col>
            </Row>
          ))}

          <h3 className="my-4">Approving Officers</h3>

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




export default AddDailyRecords;
