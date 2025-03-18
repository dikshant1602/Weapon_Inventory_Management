import React, { useState, useEffect } from 'react';
import { Form, FormGroup, Label, Input, Row, Col, Button, FormFeedback, Alert } from 'reactstrap';
import { addWeapanUnits, getCategories, getSubCategories, getWeaponDetailsForTable, getWeaponUnits } from '../../../Services/ApiServices';
import Table from '../Table/Table';

const AddWeaponDetail = () => {
  const [weaponCategory, setWeaponCategory] = useState('');
  const [weaponSubCategory, setWeaponSubCategory] = useState('');
  const [weaponName, setWeaponName] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [weaponNames, setWeaponNames] = useState([]);
  const [additionalInputs, setAdditionalInputs] = useState([]);
  const [formErrors, setFormErrors] = useState([]);
  const [weaponData, setWeaponData] = useState([]);
  const [generalError, setGeneralError] = useState('');
  const [selectedRows, setSelectedRows] = useState([]);

  useEffect(() => {
    (async function () {
      try {
        const response = await getCategories();
        setCategories(response);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  const handleWeaponCategoryChange = async (e) => {
    const category = e.target.value;
    setWeaponCategory(category);
    setWeaponSubCategory('');
    setWeaponName('');
    setSubCategories([]);
    setWeaponNames([]);
    setFormErrors([]);
    setGeneralError('');

    try {
      const response = await getSubCategories(category);
      setSubCategories(response.subCategory);
    } catch (error) {
      if (error.response && error.response.status === 500) {
        setGeneralError('Error: Server error. Please try again later.');
      } else if (error.response && error.response.status === 404) {
        setGeneralError('Error: Sub Category not found. Please try again later.');
      }
    }
  };

  const handleWeaponSubCategoryChange = async (e) => {
    const subCategory = e.target.value;
    setWeaponSubCategory(subCategory);
    setWeaponName('');
    setWeaponNames([]);
    setFormErrors([]);
    setGeneralError('');

    try {
      const response = await getWeaponDetailsForTable(weaponCategory, subCategory);
      setWeaponNames(response);
    } catch (error) {
      if (error.response && error.response.status === 500) {
        setGeneralError('Error: Server error. Please try again later.');
      } else if (error.response && error.response.status === 404) {
        setGeneralError('Error: Weapon details not found. Please try again later.');
      }
    }
  };

  const handleWeaponNameChange = async (e) => {
    const name = e.target.value;
    setWeaponName(name);
    setFormErrors([]);
    setGeneralError('');
    generateAdditionalInputs(quantity);

    try {
      const response = await getWeaponUnits(name);
      setWeaponData(response);
    } catch (error) {
      console.log(error);
    }
  };

  const handleQuantityChange = (e) => {
    const quantityValue = parseInt(e.target.value, 10);
    setQuantity(quantityValue);
    setFormErrors([]);
    setGeneralError('');
    generateAdditionalInputs(quantityValue);
  };

  const generateAdditionalInputs = (count) => {
    const inputs = [];
    for (let i = 0; i < count; i++) {
      inputs.push(
        <div key={i} className="additional-inputs">
          <Row className="mb-2">
            <Col md={4}>
              <Input type="text" className="form-control serial-number" placeholder="Serial Number" invalid={formErrors.includes(`serial-number-${i}`)} />
              <FormFeedback>Serial Number is required</FormFeedback>
            </Col>
            <Col md={4}>
              <Input type="select" className="form-control status" invalid={formErrors.includes(`status-${i}`)}>
                <option value="">Select Weapon Status</option>
                <option value="available">Available</option>
                <option value="notWorking">Not Working</option>
              </Input>
              <FormFeedback>Status is required</FormFeedback>
            </Col>
            <Col md={4}>
              <Input type="date" className="form-control manufacture-date" placeholder="Manufactured Date" invalid={formErrors.includes(`manufacture-date-${i}`)} />
              <FormFeedback>Manufacture Date is required</FormFeedback>
            </Col>
          </Row>
        </div>
      );
    }
    setAdditionalInputs(inputs);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const weaponDetailId = weaponName; // Assuming weaponName is the ID

    const errors = [];

    const data = Array.from(document.querySelectorAll('.additional-inputs')).map((inputGroup, index) => {
      const serialNumber = inputGroup.querySelector('.serial-number').value;
      const status = inputGroup.querySelector('.status').value;
      const manufactureDate = inputGroup.querySelector('.manufacture-date').value;

      if (!serialNumber) errors.push(`serial-number-${index}`);
      if (!status) errors.push(`status-${index}`);
      if (!manufactureDate) errors.push(`manufacture-date-${index}`);

      return {
        weaponDetailId,
        serialNumber,
        manufactureDate,
        status
      };
    });

    if (errors.length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors([]);

    try {
      const response = await addWeapanUnits(data);
      console.log(response);
      if(response.errors.length > 0){
        console.log("Error", response.errors);
        const errorMessages = response.errors.map(error => error.message);
        setFormErrors(errorMessages);
      }else{
        setGeneralError("Category added successfully");
      }
    } catch (error) {
      console.log(error);
      setGeneralError('An error occurred. Please try again.');
    }
  };

  // Table configuration
  const columns = [
    {
      name: 'weaponName',
      label: 'Weapon Name',
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: 'serialNumber',
      label: 'Serial Number',
      options: {
        sort: true,
        filter: false,
      },
    },
    {
      name: 'weaponType',
      label: 'Weapon Type',
      options: {
        filter: false,
        sort: true,
      },
    },
    {
      name: 'weaponSubType',
      label: 'Weapon Sub Type',
      options: {
        filter: false,
        sort: true,
      },
    },
    {
      name: 'status',
      label: 'Weapon Status',
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: 'subStatus',
      label: 'Weapon Sub Status',
      options: {
        filter: false,
        sort: true,
      },
    },
    {
      name: 'totalFire',
      label: 'Available Fire',
      options: {
        filter: false,
        sort: true,
      },
    },
    {
      name: 'issuedDate',
      label: 'Allocated Date',
      options: {
        filter: false,
        sort: true,
      },
    },
    {
      name: 'returnDate',
      label: 'Return Date',
      options: {
        filter: false,
        sort: true,
      },
    },
    {
      name: 'issuedTo',
      label: 'Weapon Allocated To',
      options: {
        filter: false,
        sort: true,
        customBodyRender: (value) => {
          if (Array.isArray(value) && value.length > 0) {
            return value.map(({ name, armyId }) => `${name} (${armyId})`).join(', ');
          }
          return 'N/A';
        }
      },
    },
    {
      name: 'signNCO',
      label: 'Sign NCO',
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: 'signJCO',
      label: 'Sign JCO',
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: 'signCO',
      label: 'Sign CO',
      options: {
        filter: true,
        sort: true,
      },
    },
  ];

  const options = {
    filterType: 'select',
    responsive: 'standard',
    selectableRows: 'multiple',
    onRowSelectionChange: (currentRowsSelected, allRowsSelected) => {
      setSelectedRows(allRowsSelected.map(row => row.index));
    },
  };

  return (
    <>
      <div className='container mt-5'>
        <div className='text-white p-4 rounded' style={{ backgroundColor: '#1c170ed2', color: '#f4f4f4' }}>
          <h1 className='text-center mb-4'>Add Weapon</h1>
          <Form onSubmit={handleSubmit}>
            {generalError && <Alert color="danger">{generalError}</Alert>}
            {formErrors.length > 0 && (
              <Alert color="danger">
                {formErrors.map((error, index) => (
                  <div key={index}>{error}</div>
                ))}
              </Alert>
            )}
            <Row className="mb-3">
              <Col md={6}>
                <FormGroup>
                  <Label for="weaponCategorySelect">Weapon Category:</Label>
                  <Input type="select" id="weaponCategorySelect" className="form-control" value={weaponCategory} onChange={handleWeaponCategoryChange} invalid={formErrors.includes('weaponCategory')}>
                    <option value="">Select a category</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.category}>{category.category}</option>
                    ))}
                  </Input>
                  <FormFeedback>Weapon Category is required</FormFeedback>
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label for="weaponSubCategorySelect">Weapon Sub-Category:</Label>
                  <Input type="select" id="weaponSubCategorySelect" className="form-control" value={weaponSubCategory} onChange={handleWeaponSubCategoryChange} disabled={!weaponCategory} invalid={formErrors.includes('weaponSubCategory')}>
                    <option value="">Select a sub-category</option>
                    {subCategories.map(subCategory => (
                      <option key={subCategory} value={subCategory}>{subCategory}</option>
                    ))}
                  </Input>
                  <FormFeedback>Weapon Sub-Category is required</FormFeedback>
                </FormGroup>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md={6}>
                <FormGroup>
                  <Label for="weaponNameSelect">Weapon Name:</Label>
                  <Input type="select" id="weaponNameSelect" className="form-control" value={weaponName} onChange={handleWeaponNameChange} disabled={!weaponSubCategory} invalid={formErrors.includes('weaponName')}>
                    <option value="">Select a weapon</option>
                    {weaponNames.map(name => (
                      <option key={name._id} value={name._id}>{name.name}</option>
                    ))}
                  </Input>
                  <FormFeedback>Weapon Name is required</FormFeedback>
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label for="quantitySelect">Quantity:</Label>
                  <Input type="select" id="quantitySelect" className="form-control" value={quantity} onChange={handleQuantityChange}>
                    {[...Array(10).keys()].map(num => (
                      <option key={num + 1} value={num + 1}>{num + 1}</option>
                    ))}
                  </Input>
                </FormGroup>
              </Col>
            </Row>
            {additionalInputs}
            <Button type="submit" style={{ backgroundColor: '#1f372f', color: '#f4f4f4', border: 'none' }} block>Add Weapon</Button>
          </Form>
        </div>
      </div>
      <div style={{ width: '96%', marginTop: '20px' }}>
        <Table data={weaponData} columns={columns} options={options} records={"Weapons"} />
      </div>
    </>
  );
};

export default AddWeaponDetail;
