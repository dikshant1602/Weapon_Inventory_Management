import React, { useEffect, useState } from 'react';
import { Button , Alert } from 'react-bootstrap';
import { Form, FormGroup, Label, Input, Row, Col } from 'reactstrap';
import { addWeaponDetail, getBullets, getCategories, getSubCategories, getWeaponDetailsForTable } from '../../../Services/ApiServices';
import Table from '../Table/Table';

const AddWeapon = () => {
  const [category, setCategory] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [weaponCount, setWeaponCount] = useState(0);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [weponDetails, setWeponDetails] = useState([]);
  const [weaponFormData, setWeaponFormData] = useState([]);
  const [bulletOptions , setBulletOptions] = useState([]);
  const [bulletCount, setBulletCount] = useState({});
  const [maintenanceLimit] = useState(1000); // Example maintenance limit
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    (async function () {
      try {
        const response = await getCategories();
        setCategories(response);
        const res = await getBullets();
        console.log(res);
        setBulletOptions(res);
      } catch (error) {
        if (error.response && error.response.status === 500) {
          setErrors("Error: Server error. Please try again later.");       
        }

        if (error.response && error.response.status === 404) {
          setErrors("Error: Category not found. Please try again later.");
        }
        }

      
    })();
  }, []);

  const columns = [
    {
      name: 'name',
      label: 'Weapon Name',
      options: {
        filter: true,
        sort: true,
      },
    },

    {
      name: 'category',
      label: 'Category',
      options: {
        filter: true,
        sort: true,
      },
    },

    {
      name: 'subCategory',
      label: 'SubCategory',
      options: {
        filter: true,
        sort: true,
      },
    },

    {
      name: 'totalFire',
      label: 'Maintenance Limit',
      options: {
        filter: true,
        sort: true,
      },
    },

    {
      name: 'typeOfBullet',
      label: 'Bullet Type',
      options: {
        filter: true,
        sort: true,
      },
    },
  ];

  const options = {
    filterType: 'select',
  };

  const handleCategoryChange = async (e) => {
    setCategory(e.target.value);
    try {
      const response = await getSubCategories(e.target.value);
      setSubcategories(response.subCategory);

    } catch (error) {
      console.log(error);
    }
  };

  const handleSubcategoryChange = async (e) => {
    setSubcategory(e.target.value);
    try {
      const response = await getWeaponDetailsForTable(category, e.target.value);
      setWeponDetails(response);
    } catch (error) {
      console.log(error);

    }
  };

  const handleDropdownChange = (e) => {
    setWeaponCount(Number(e.target.value));
  };

  const handleWeaponNameChange = (index, e) => {
    const newWeaponFormData = [...weaponFormData];
    newWeaponFormData[index] = {
      ...newWeaponFormData[index],
      name: e.target.value,
      category,
      subCategory: subcategory,
    };
    setWeaponFormData(newWeaponFormData);
  };

  const handleBulletChange = (index, e) => {
    const newWeaponFormData = [...weaponFormData];
    newWeaponFormData[index] = {
      ...newWeaponFormData[index],
      bullet: e.target.value,
    };
    setWeaponFormData(newWeaponFormData);
  };

  const handleBulletCountChange = (index, e) => {
    const newWeaponFormData = [...weaponFormData];
    newWeaponFormData[index] = {
      ...newWeaponFormData[index],
      bulletCount: Number(e.target.value),
    };
    setWeaponFormData(newWeaponFormData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await addWeaponDetail(weaponFormData);
      if(response.errors.length > 0){
        console.log("Error", response.errors);
        const errorMessages = response.errors.map(error => error.message);
        setErrors(errorMessages);
      }else{
        setErrors("Category added successfully");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <h1 className="text-center">Add Weapon Name</h1>

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
            <Col md={4}>
              <FormGroup>
                <Label for="categorySelect">Select Category</Label>
                <Input
                  type="select"
                  name="categorySelect"
                  id="categorySelect"
                  onChange={handleCategoryChange}
                  style={{ backgroundColor: '#555', color: '#fff', borderColor: '#666' }}
                >
                  <option value="">Select a category</option>
                  {categories.map(category => (
                    <option key={category._id} value={category.category}>{category.category}</option>
                  ))}
                </Input>
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup>
                <Label for="subcategorySelect">Select Subcategory</Label>
                <Input
                  type="select"
                  name="subcategorySelect"
                  id="subcategorySelect"
                  onChange={handleSubcategoryChange}
                  style={{ backgroundColor: '#555', color: '#fff', borderColor: '#666' }}
                >
                  <option value="">Select a subcategory</option>
                  {subcategories.map(subcategory => (
                    <option key={subcategory} value={subcategory}>{subcategory}</option>
                  ))}
                </Input>
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup>
                <Label for="dropdown">Select Weapon Count</Label>
                <Input
                  type="select"
                  name="select"
                  id="dropdown"
                  onChange={handleDropdownChange}
                  style={{ backgroundColor: '#555', color: '#fff', borderColor: '#666' }}
                >
                  <option value="0">Select a number</option>
                  {[...Array(10).keys()].map((number) => (
                    <option key={number + 1} value={number + 1}>
                      {number + 1}
                    </option>
                  ))}
                </Input>
              </FormGroup>
            </Col>
          </Row>
          {new Array(weaponCount).fill(0).map((_, index) => (
            <Row form key={index}>
              <Col md={4}>
                <FormGroup>
                  <Label for={`weaponName${index + 1}`}>Weapon Name {index + 1}</Label>
                  <Input
                    type="text"
                    name={`weaponName${index + 1}`}
                    id={`weaponName${index + 1}`}
                    placeholder={`Enter weapon name ${index + 1}`}
                    onChange={(e) => handleWeaponNameChange(index, e)}
                    style={{ backgroundColor: '#555', color: '#fff', borderColor: '#666' }}
                  />
                </FormGroup>
              </Col>
              <Col md={4}>
                <FormGroup>
                  <Label for={`bulletSelect${index + 1}`}>Select Bullet</Label>
                  <Input
                    type="select"
                    name={`bulletSelect${index + 1}`}
                    id={`bulletSelect${index + 1}`}
                    onChange={(e) => handleBulletChange(index, e)}
                    style={{ backgroundColor: '#555', color: '#fff', borderColor: '#666' }}
                  >
                    <option value="">Select a bullet</option>
                    {bulletOptions.map(bullet => (
                      <option key={bullet.id} value={bullet.typeName}>{bullet.typeName}</option>
                    ))}
                  </Input>
                </FormGroup>
              </Col>
              <Col md={4}>
                <FormGroup>
                  <Label for={`bulletCount${index + 1}`}>Bullet Count</Label>
                  <Input
                    type="number"
                    name={`bulletCount${index + 1}`}
                    id={`bulletCount${index + 1}`}
                    placeholder="Enter bullet count"
                    onChange={(e) => handleBulletCountChange(index, e)}
                    style={{ backgroundColor: '#555', color: '#fff', borderColor: '#666' }}
                  />
                </FormGroup>
              </Col>
            </Row>
          ))}
          <Button color="primary" type="submit" style={{ width: '100%', background: '#1f372f', border: 'none' }}>Add</Button>
        </Form>
        <div style={{ marginTop: '20px', color: '#fff' }}>
          {category && subcategory && (
            <p>
              Weapons will be added to <strong>{category}</strong> in <strong>{subcategory}</strong>
            </p>
          )}
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '20px', marginLeft: '20px' , marginRight: '20px' }}>
        <Table data={weponDetails} columns={columns} options={options} />
      </div>
    </>
  );
};

export default AddWeapon;
