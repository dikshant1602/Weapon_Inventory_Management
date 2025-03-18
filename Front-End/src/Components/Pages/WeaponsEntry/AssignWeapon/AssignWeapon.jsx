import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Card, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { addWeaponIssued, fetchCadets, fetchWeaponIssued, signVerify } from '../../../../Services/ApiServices';

const dailyrecords = () => {
  const [formData, setFormData] = useState({
    weaponId : '',
    serialNo: '',
    weaponName: '',
    category: '',
    subCategory: '',
    cadetDetails: [{ armyNo: '', name: '', rank: '', isfetch : false }],
    numberOfSoldiers: 1,
    signNCO: 'pending',
    signJCO: 'pending',
    signCO: 'pending',
  });

  const [isDataFetched, setIsDataFetched] = useState(false);
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

  const handleSerialNoChange = (e) => {
    const serialNo = e.target.value;
    setFormData({ ...formData, serialNo });
  };

  const handleFetchData = async () => {
    const { serialNo } = formData;
    try {
      const response = await fetchWeaponIssued(serialNo);
      setIsDataFetched(true);
      const data = response;
      console.log(data);
      setFormData({
        ...formData,
        weaponName: data.weaponName,
        category: data.weaponType,
        subCategory: data.weaponSubType,
        weaponId: data._id
      });
      setError('');
      setSuccessMessage('Weapon details fetched successfully.');
    } catch (error) {
      console.log(error);
      if (error.response && error.response.status === 401) {
        setError('Weapon not found');
      } else if (error.response && error.response.status === 403) {
        setError('Weapon is not issued');
      } else if (error.response && error.response.status === 405) {
        setError('Weapon is not in inventory status');
      } else {
        setError('An error occurred while fetching weapon details');
      }
      setSuccessMessage('');
    }
  };

  const handleNumberOfSoldiersChange = (e) => {
    const numberOfSoldiers = parseInt(e.target.value, 10);
    const cadetDetails = Array.from({ length: numberOfSoldiers }, () => ({ armyNo: '', name: '', rank: '' }));
    setFormData({ ...formData, numberOfSoldiers, cadetDetails });
  };

  const handleFetchArmyDetails = async (index) => {
    const armyNo = formData.cadetDetails[index].armyNo;
    try {
      const response = await fetchCadets(armyNo);
      const data = response;
      console.log(response);
      const updatedCadetDetails = [...formData.cadetDetails];
      updatedCadetDetails[index] = {
        armyNo: data.armyId,
        name: data.name,
        rank: data.rank,
        isfetch : true
      };
      setFormData({ ...formData, cadetDetails: updatedCadetDetails });
      setSuccessMessage(`Army details for ${armyNo} fetched successfully.`);
    } catch (error) {
      console.error('Error fetching soldier details:', error);
      setError('An error occurred while fetching soldier details');
      setSuccessMessage('');
    }
  };

  const handleCadetInputChange = (e, index) => {
    const { name, value } = e.target;
    const updatedCadetDetails = [...formData.cadetDetails];
    updatedCadetDetails[index][name] = value;
    setFormData({ ...formData, cadetDetails: updatedCadetDetails });
  };

  const handleLoginInputChange = (e, index) => {
    const { name, value } = e.target;
    const updatedLoginDetails = [...loginDetails];
    updatedLoginDetails[index][name] = value;
    setLoginDetails(updatedLoginDetails);
  };





  const handleApprove = async (index) => {
    const { officerUsername, password, role } = loginDetails[index];
    console.log(officerUsername, password, role);

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

    if (formData.signNCO === 'pending' ) {
      setError('Please approve NCO signature');
      return;
    }

    
    try {
      const response = await addWeaponIssued(formData);
      if (response) {
        setSuccessMessage('Weapon allotted to cadet');
        setError('');
        
      }
    } catch (error) {
      console.log(error);
      if (error.response && error.response.status === 401) {
        setError('Error adding record: officer not found');
      } else {
        setError('An error occurred while adding the record');
      }
      setSuccessMessage('');
    }
    console.log('Form submitted:', { formData, loginDetails });
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
        <h2 className="my-4 text-center">Allot Weapon</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        {successMessage && <Alert variant="success">{successMessage}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Row className="mb-4">
            <Col xs={12} md={6}>
              <Form.Group controlId="formSerialNo">
                <Form.Label>Serial No</Form.Label>
                <div className="d-flex align-items-center">
                  <Form.Control
                    type="text"
                    name="serialNo"
                    value={formData.serialNo}
                    onChange={handleSerialNoChange}
                    required
                    disabled={isDataFetched}
                    className="bg-dark text-light"
                  />
                  <Button variant="primary" onClick={handleFetchData} className="ml-2" style={{ marginLeft: '10px', background: '#1f372f', border: '#1f372f'}}>
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
          <Row className="mb-4">
            <Col xs={12} md={6}>
              <Form.Group controlId="formCategory">
                <Form.Label>Category</Form.Label>
                <Form.Control
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  disabled={isDataFetched}
                  className="bg-dark text-light"
                />
              </Form.Group>
            </Col>
            <Col xs={12} md={6}>
              <Form.Group controlId="formSubCategory">
                <Form.Label>Sub-Category</Form.Label>
                <Form.Control
                  type="text"
                  name="subCategory"
                  value={formData.subCategory}
                  onChange={handleInputChange}
                  required
                  disabled={isDataFetched}
                  className="bg-dark text-light"
                />
              </Form.Group>
            </Col>
          </Row>
          <Form.Group controlId="formNumberOfSoldiers" className="mb-4">
            <Form.Label>Number of Soldiers</Form.Label>
            <Form.Control
              type="number"
              name="numberOfSoldiers"
              value={formData.numberOfSoldiers}
              onChange={handleNumberOfSoldiersChange}
              required
              className="bg-dark text-light"
            />
          </Form.Group>
          {formData.cadetDetails.map((cadet, index) => (
            <Card className="bg-dark text-light mb-4" key={index}>
              <Card.Body>
                <Row className="mb-3">
                  <Col xs={12} md={4}>
                    <Form.Group controlId={`formArmyNo${index}`}>
                      <Form.Label>Army No</Form.Label>
                      <div className="d-flex align-items-center">
                        <Form.Control
                          type="text"
                          name="armyNo"
                          value={cadet.armyNo}
                          onChange={(e) => handleCadetInputChange(e, index)}
                          disabled={cadet.isfetch}
                          required
                          className="bg-dark text-light"
                        />
                        <Button 
                          variant="primary" 
                          onClick={() => handleFetchArmyDetails(index)} 
                          className="ml-2" 
                          disabled={cadet.isfetch}
                          style={{ marginLeft: '10px', background: '#1f372f', border: '#1f372f' }}
                        >
                          Fetch
                        </Button>
                      </div>
                    </Form.Group>
                  </Col>
                  <Col xs={12} md={4}>
                    <Form.Group controlId={`formName${index}`}>
                      <Form.Label>Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        value={cadet.name}
                        onChange={(e) => handleCadetInputChange(e, index)}
                        disabled={cadet.isfetch}
                        required
                        className="bg-dark text-light"
                      />
                    </Form.Group>
                  </Col>
                  <Col xs={12} md={4}>
                    <Form.Group controlId={`formRank${index}`}>
                      <Form.Label>Rank</Form.Label>
                      <Form.Control
                        type="text"
                        name="rank"
                        value={cadet.rank}
                        onChange={(e) => handleCadetInputChange(e, index)}
                        disabled={cadet.isfetch}
                        required
                        className="bg-dark text-light"
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          ))}
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
          <div className="text-center">
            <Button type="submit" variant="success" className="px-5" style={{ background: '#1f372f', border: '#1f372f' }}>Submit</Button>
          </div>
        </Form>
        <div className="mt-3 text-center">
          <Link to="/allotweapon">
            <Button variant="secondary" style={{ background: '#1f372f', border: '#1f372f' }}>Back</Button>
          </Link>
        </div>
      </Container>
    </div>
  );
};

export default dailyrecords;
