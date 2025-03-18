import React, { useEffect, useState } from 'react';
import { Form, FormGroup, Label, Input, Button, Row, Col } from 'reactstrap';
import { addSubCategory, getCategories, getSubCategories } from '../../../Services/ApiServices';
import Table from '../Table/Table';

const Subcategory = () => {
  const [category, setCategory] = useState('');
  const [subcategoryCount, setSubcategoryCount] = useState(0);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState({});
  const [errors, setErrors] = useState({});
  const [subCategoryData, setSubCategoryData] = useState([]);


  //for table 

  const columns = [
    {
      name: 'subcategory',
      label: 'Category Name',
      options: {
        filter: true,
        sort: true,
      },
    },
  ];

 const options = {
    filterType: 'select',
  };


  useEffect(() => {
    (async function () {
      try {
        const response = await getCategories();
        console.log("response", response);
        setCategories(response);
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

  const handleCategoryChange = async (e) => {
    setCategory(e.target.value);

    try {
       
      const response = await getSubCategories(e.target.value);
      console.log("response", response.subCategory);

      const tableData = response.subCategory.map((item, index) => ({
        subcategory: item,
      }));

      setSubCategoryData(tableData);
      

  } catch (error) {
    if (error.response && error.response.status === 500) {
      setErrors("Error: Server error. Please try again later.");       
    }
    if (error.response && error.response.status === 404) {
      setErrors("Error: Sub Category not found. Please try again later.");
    }  }

  };

  const handleDropdownChange = (e) => {
    setSubcategoryCount(Number(e.target.value));
  };

  const handleSubcategoryChange = (index, e) => {
    const { value } = e.target;
    setSubcategories((prevSubcategories) => ({
      ...prevSubcategories,
      [index]: value,
    }));
  };

  const validateForm = () => {
    let valid = true;
    let newErrors = {};

    if (!category) {
      valid = false;
      newErrors.category = 'Category is required';
    }

    for (let i = 0; i < subcategoryCount; i++) {
      if (!subcategories[i]) {
        valid = false;
        newErrors[`subcategory${i}`] = `Subcategory ${i + 1} is required`;
      }
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      console.log('Validation failed');
      return;
    }

    const subCategoryArray = Object.values(subcategories);
    const formData = {
      category,
      subCategories: subCategoryArray,
    };
    console.log('Form Data:', formData);
    console.log("Form submitted");

    // Make an API call with formData
    try {
      const response = await addSubCategory(formData);
      console.log('API response:', response);
      alert('Subcategories added successfully');
    } catch (error) {
      console.error('Error adding subcategories:', error);
      alert('all sub categories already exist');
    }
  };

  return (
    <>
    <h1 className="text-center">Add Sub Category</h1>
    <div className="container mt-5" style={{ backgroundColor: '#1c170ed2', color: '#fff', padding: '20px', borderRadius: '8px' }}>
      <Form onSubmit={handleSubmit}>
        <Row form>
          <Col md={6}>
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
                {categories.map((category) => (
                  <option key={category.category} value={category.category}>{category.category}</option>
                ))}
              </Input>
              {errors.category && <p style={{ color: 'red' }}>{errors.category}</p>}
            </FormGroup>
          </Col>
          <Col md={6}>
            <FormGroup>
              <Label for="dropdown">Select Subcategory Count</Label>
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
        <Row form>
          {[...Array(subcategoryCount).keys()].map((index) => (
            <Col md={6} key={index}>
              <FormGroup>
                <Label for={`subcategoryName${index + 1}`}>Subcategory Name {index + 1}</Label>
                <Input
                  type="text"
                  name={`subcategoryName${index + 1}`}
                  id={`subcategoryName${index + 1}`}
                  placeholder={`Enter subcategory name ${index + 1}`}
                  onChange={(e) => handleSubcategoryChange(index, e)}
                  style={{ backgroundColor: '#555', color: '#fff', borderColor: '#666' }}
                />
                {errors[`subcategory${index}`] && <p style={{ color: 'red' }}>{errors[`subcategory${index}`]}</p>}
              </FormGroup>
            </Col>
          ))}
        </Row>
        <Button color="primary" type="submit" style={{ width: '100%', background: '#1f372f', border: 'none' }}>Add</Button>
      </Form>
      <div style={{ marginTop: '20px', color: '#fff' }}>
        {category && (
          <p>
            Subcategory will be added to <strong>{category}</strong>
          </p>
        )}
      </div>
    </div>
    <div style={{ width: '96%', marginTop: '20px' }}>
        <Table data={subCategoryData}   columns={columns} options={options} records={category} />
      </div>
    </>
  );
};

export default Subcategory;
