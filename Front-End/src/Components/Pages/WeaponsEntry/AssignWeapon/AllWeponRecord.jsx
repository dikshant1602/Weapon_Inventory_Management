import React, { useState, useEffect } from 'react';
import { Button, Container, Modal, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Import eye icons
import Table from '../../Table/Table'; // Make sure this path is correct
import { approveCOJCO, approveCOJCODamage, approveCOJCOOneTime, fetchDamageRecords, getWeaponDetails, signVerify } from '../../../../Services/ApiServices';

const AllWeponRecord = () => {
  const navigate = useNavigate();
  const [dailyRecord, setDailyRecord] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [authType, setAuthType] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const [refetch, setRefetch] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getWeaponDetails();
        console.log("response", response);
        setDailyRecord(response);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [refetch]);

  const handleReturnButtonClick = (rowData) => {
    console.log('Return button clicked for rowData:', rowData);
    navigate('/wepoanreturnDaily', { state: rowData });
  };

  const getSelectedIds = () => {
    return selectedRows.map(rowIndex => dailyRecord[rowIndex]._id);
  };

  const toggleModal = (type = '') => {
    setAuthType(type);
    setIsModalOpen(true);
  };

  const handleAuthSubmit = async () => {
    console.log('Authenticating', { username, password, authType });

    try {
      const response = await signVerify(authType, username, password);
      if (response) {
        const selectedID = getSelectedIds();
        console.log("selectedID", selectedID, "response", response, "authType", authType);
        await approveCOJCOOneTime(response, selectedID, authType);
        setRefetch(!refetch);
        setIsModalOpen(false);
        setSelectedRows([]);
      }
    } catch (error) {
      console.log('Auth Error:', error);
    }
  };

  const columns = [
    { name: 'weaponName', label: 'Weapon Name', options: { filter: true, sort: true } },
    { name: 'serialNumber', label: 'Serial Number', options: { sort: true, filter: false } },
    { name: 'weaponType', label: 'Weapon Type', options: { filter: false, sort: true } },
    { name: 'weaponSubType', label: 'Weapon Sub Type', options: { filter: false, sort: true } },
    { name: 'status', label: 'Weapon Status', options: { filter: true, sort: true } },
    { name: 'subStatus', label: 'Weapon Sub Status', options: { filter: false, sort: true } },
    { name: 'totalFire', label: 'Available Fire', options: { filter: false, sort: true } },
    { name: 'issuedDate', label: 'Allocated Date', options: { filter: false, sort: true } },
    { name: 'returnDate', label: 'Return Date', options: { filter: false, sort: true } },
    {
      name: 'issuedTo', label: 'Weapon Allocated To', options: {
        filter: false, sort: true,
        customBodyRender: (value) => {
          if (Array.isArray(value) && value.length > 0) {
            return value.map(({ name, armyId }) => `${name} (${armyId})`).join(', ');
          }
          return 'N/A';
        },
      },
    },
    { name: 'signNCO', label: 'Sign NCO', options: { filter: true, sort: true } },
    { name: 'signJCO', label: 'Sign JCO', options: { filter: true, sort: true } },
    { name: 'signCO', label: 'Sign CO', options: { filter: true, sort: true } },
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
      <Container className="d-flex justify-content-end align-items-center mt-3">
        <Button 
          variant="primary" 
          style={{ 
            marginLeft: '10px', 
            backgroundColor: '#1f372f', 
            borderColor: '#1f372f', 
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.6)' 
          }} 
          onClick={() => toggleModal('CO')}
        >
          Approval CO
        </Button>
        <Button 
          variant="primary" 
          style={{ 
            marginLeft: '10px', 
            backgroundColor: '#1f372f', 
            borderColor: '#1f372f', 
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.6)' 
          }} 
          onClick={() => toggleModal('JCO')}
        >
          Approval JCO
        </Button>
      </Container>
      <div className="d-flex justify-content-center align-items-center mt-4">
        <Table columns={columns} data={dailyRecord} options={options} records={"All Weapon Records"} />
      </div>
      <Modal 
        show={isModalOpen} 
        onHide={() => setIsModalOpen(false)}
        dialogClassName="custom-modal"
        style={{ backdropFilter: 'blur(5px)' }} // Apply blur effect for the modal backdrop
      >
        <div style={{ backgroundColor: '#1c170ed2', boxShadow: '0 0 20px 5px rgba(255, 255, 255, 0.6)', border: 'none' }}>
          <Modal.Header 
            closeButton 
            style={{ backgroundColor: '#1c170eaa', color: '#fff', borderBottom: '1px solid white' }}
          >
            <Modal.Title>Authentication Required</Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ backgroundColor: '#1c170ed2', color: '#fff' }}>
            <Form>
              <Form.Group controlId="formUsername">
                <Form.Label>Username</Form.Label>
                <Form.Control 
                  type="text" 
                  placeholder="Enter username" 
                  value={username} 
                  onChange={(e) => setUsername(e.target.value)} 
                  style={{ backgroundColor: '#2a2a2a', color: '#fff', borderColor: '#2a2a2a' }}
                />
              </Form.Group>
              <Form.Group controlId="formPassword" className="mt-2 position-relative">
                <Form.Label>Password</Form.Label>
                <div className="position-relative">
                  <Form.Control 
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    style={{ backgroundColor: '#2a2a2a', color: '#fff', borderColor: '#2a2a2a', paddingRight: '3rem' }}
                  />
                  <Button 
                    variant="link" 
                    onClick={() => setShowPassword(!showPassword)} 
                    className="position-absolute end-0 top-50 translate-middle-y"
                    style={{ background: 'transparent', border: 'none', color: '#ffffff', fontSize: '1.2rem' }}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </Button>
                </div>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer style={{ backgroundColor: '#1c170eaa', borderTop: '1px solid white' }}>
            <Button variant="secondary" onClick={() => setIsModalOpen(false)} style={{ backgroundColor: '#1f372f', border: 'none' }}>
              Cancel
            </Button>
            <Button 
              variant="primary" 
              style={{ backgroundColor: '#1f372f', borderColor: '#1f372f'}}
              onClick={handleAuthSubmit}
            >
              Submit
            </Button>
          </Modal.Footer>
        </div>
      </Modal>
    </>
  );
};

export default AllWeponRecord;
