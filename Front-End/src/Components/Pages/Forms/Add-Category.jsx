import React, { useEffect, useState } from 'react';
import { Form, FormGroup, Label, Input, Button, Row, Col, Alert } from 'reactstrap';
import { addCategory, getCategories } from '../../../Services/ApiServices';
import Table from '../Table/Table';

const AddCategory = () => {
  const [categoryCount, setCategoryCount] = useState(0);
  const [subCategoryCounts, setSubCategoryCounts] = useState([]);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    (async function () {
      try {
        const response = await getCategories();
        console.log("response", response);
        setCategories(response);
      } catch (error) {
        if (error.response && error.response.status === 500) {
          setErrors("Error: Server error. Please try again later.");       }
        }
       
    })();
  }, []);


  //for table 

  const columns = [
    {
      name: 'category',
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



  const handleCategoryCountChange = (e) => {
    const count = Number(e.target.value);
    setCategoryCount(count);
    setSubCategoryCounts(new Array(count).fill(0)); // Reset subcategory counts
    setFormData({});
    setErrors([]);
  };

  const handleSubCategoryCountChange = (index, e) => {
    const newCounts = [...subCategoryCounts];
    newCounts[index] = Number(e.target.value);
    setSubCategoryCounts(newCounts);
    setErrors([]);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setErrors([]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = [];
    const formattedData = [];

    for (let i = 0; i < categoryCount; i++) {
      const category = formData[`categoryName${i + 1}`];
      if (!category) {
        newErrors.push(`Category ${i + 1} name is required.`);
        continue;
      }

      const subCategories = [];
      for (let j = 0; j < subCategoryCounts[i]; j++) {
        const subCategory = formData[`subCategory${i + 1}_${j + 1}`];
        if (!subCategory) {
          newErrors.push(`Subcategory ${j + 1} for Category ${i + 1} is required.`);
        } else {
          subCategories.push(subCategory);
        }
      }

      formattedData.push({
        category,
        subCategory: subCategories
      });
    }

    if (newErrors.length > 0) {
      setErrors(newErrors);
      return;
    }

    console.log(formattedData);

    addCategory(formattedData)
      .then(response => {
        console.log(`he he`, response);
        if(response.errors.length > 0){
          console.log("Error", response.errors);
          const errorMessages = response.errors.map(error => error.message);
          setErrors(errorMessages);
        }else{
          setErrors("Category added successfully");
        }
        
      })
      .catch(error => {
        console.log(error);
      });
    console.log("Category added");
  };

  return (
    <>
      <h1 className="text-center">Add Category</h1>
      <div className="container mt-5" style={{ width: '100%', backgroundColor: '#1c170ed2', color: '#ffffff', padding: '10px', borderRadius: '8px' }}>
        <Form onSubmit={handleSubmit}>
          {errors.length > 0 && (
            <Alert color="danger">
              {errors.map((error, index) => (
                <div key={index}>{error}</div>
              ))}
            </Alert>
          )}
          <Row form>
            <Col md={6}>
              <FormGroup>
                <Label for="categoryCount">Number of Categories</Label>
                <Input
                  type="select"
                  name="categoryCount"
                  id="categoryCount"
                  onChange={handleCategoryCountChange}
                  style={{ backgroundColor: '#333', color: '#ffffff', borderColor: '#666' }}
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
          {new Array(categoryCount).fill(0).map((_, catIndex) => (
            <div key={catIndex} className="category-section" style={{ marginBottom: '20px' }}>
              <Row form>
                <Col md={6}>
                  <FormGroup>
                    <Label for={`categoryName${catIndex + 1}`}>Category {catIndex + 1} Name</Label>
                    <Input
                      type="text"
                      name={`categoryName${catIndex + 1}`}
                      id={`categoryName${catIndex + 1}`}
                      placeholder={`Enter category ${catIndex + 1} name`}
                      onChange={handleChange}
                      style={{ backgroundColor: '#333', color: '#ffffff', borderColor: '#666' }}
                    />
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label for={`subCategoryCount${catIndex + 1}`}>Select Subcategories</Label>
                    <Input
                      type="select"
                      name={`subCategoryCount${catIndex + 1}`}
                      id={`subCategoryCount${catIndex + 1}`}
                      onChange={(e) => handleSubCategoryCountChange(catIndex, e)}
                      style={{ backgroundColor: '#333', color: '#ffffff', borderColor: '#666' }}
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
              {new Array(subCategoryCounts[catIndex]).fill(0).map((_, subIndex) => (
                <Row form key={subIndex}>
                  <Col md={6}>
                    <FormGroup>
                      <Label for={`subCategory${catIndex + 1}_${subIndex + 1}`}>Sub Category {subIndex + 1}</Label>
                      <Input
                        type="text"
                        name={`subCategory${catIndex + 1}_${subIndex + 1}`}
                        id={`subCategory${catIndex + 1}_${subIndex + 1}`}
                        placeholder={`Enter sub category ${subIndex + 1}`}
                        onChange={handleChange}
                        style={{ backgroundColor: '#333', color: '#ffffff', borderColor: '#666' }}
                      />
                    </FormGroup>
                  </Col>
                </Row>
              ))}
            </div>
          ))}
          <Button color="primary" type="submit" style={{ width: '100%', background: '#1f372f', border: 'none' }}>Add</Button>
        </Form>
      </div>
      <div style={{ width: '96%', marginTop: '20px' }}>
        <Table data={categories} columns={columns} options={options} records={'Categories'} />
      </div>
    </>
  );
};

export default AddCategory;
