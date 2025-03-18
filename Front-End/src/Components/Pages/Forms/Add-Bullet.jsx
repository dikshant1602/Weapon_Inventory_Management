import React, { useState } from 'react';
import { Button , Alert } from 'react-bootstrap';
import { Form, FormGroup, Label, Input, Row, Col } from 'reactstrap';
import { addBullet } from '../../../Services/ApiServices';

const AddBullet = () => {
  const [bulletCount, setBulletCount] = useState(0);
  const [bulletFormData, setBulletFormData] = useState([]);
  const [errors, setErrors] = useState([]);

  const handleBulletNameChange = (index, e) => {
    const newBulletFormData = [...bulletFormData];
    newBulletFormData[index] = e.target.value;
    setBulletFormData(newBulletFormData);
  };

  const increaseCount = () => {
    setBulletCount(bulletCount + 1);
  };

  const decreaseCount = () => {
    if (bulletCount > 0) {
      setBulletCount(bulletCount - 1);
      setBulletFormData(bulletFormData.slice(0, -1));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Bullet Form Data:', bulletFormData);

    try {
      
      const response = await addBullet(bulletFormData);
      console.log('Response:', response);
      if(response.errors.length > 0){
        console.log("Error", response.errors);
        const errorMessages = response.errors.map(error => error.message);
        setErrors(errorMessages);
      }else{
        setErrors("Category added successfully");
      }
      setBulletCount(0);
      setBulletFormData([]);
      
    } catch (error) {
      console.log(error); 
    }

  };

  return (
    <>
      <h1 className="text-center">Add Bullet Name</h1>

      <div className="container mt-5" style={{ backgroundColor: '#1c170ed2', color: '#fff', padding: '20px', borderRadius: '8px' }}>
        <Form onSubmit={handleSubmit}>
        {errors.length > 0 && (
            <Alert color="danger">
              {errors.map((error, index) => (
                <div key={index}>{error}</div>
              ))}
            </Alert>
          )}
          <Row form>
            <Col md={12} className="text-center mb-3">
              <Button variant="secondary" onClick={decreaseCount} style={{ marginRight: '10px' }}>-</Button>
              <span style={{ fontSize: '1.2em' }}> {bulletCount} </span>
              <Button variant="secondary" onClick={increaseCount} style={{ marginLeft: '10px' }}>+</Button>
            </Col>
          </Row>
          <Row form>
            {new Array(bulletCount).fill(0).map((_, index) => (
              <Col md={4} key={index}>
                <FormGroup>
                  <Label for={`bulletName${index + 1}`}>Bullet Name {index + 1}</Label>
                  <Input
                    type="text"
                    name={`bulletName${index + 1}`}
                    id={`bulletName${index + 1}`}
                    placeholder={`Enter bullet name ${index + 1}`}
                    onChange={(e) => handleBulletNameChange(index, e)}
                    style={{ backgroundColor: '#555', color: '#fff', borderColor: '#666' }}
                  />
                </FormGroup>
              </Col>
            ))}
          </Row>
          <Button color="primary" type="submit" style={{ width: '100%', background: '#1f372f', border: 'none' }}>Add</Button>
        </Form>
      </div>
    </>
  );
};

export default AddBullet;
