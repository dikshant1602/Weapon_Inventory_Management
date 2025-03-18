import React, { useState, useEffect } from 'react';
import { Button, Container, Modal, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Table from '../../Table/Table';
import { approveCOJCODamage, fetchDamageRecords, signVerify, reatunInDamage } from '../../../../Services/ApiServices';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const DamageWeaponRecords = () => {
  const navigate = useNavigate();
  const [dailyRecord, setDailyRecord] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [authType, setAuthType] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false); // State for password visibility
  const [refetch, setRefetch] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchDamageRecords();
        console.log("response", response);
        setDailyRecord(response);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [refetch]);

  const handleReturnButtonClick = async (rowData) => {
    console.log('Return button clicked for rowData:', rowData._id);
    try {
      const response = await reatunInDamage(rowData._id);
      console.log("response", response);
      setRefetch(!refetch);
    } catch (error) {
      console.log(error);
    }
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
        await approveCOJCODamage(response, selectedID, authType);
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
    { name: 'damageType', label: 'Damage Type', options: { filter: false, sort: true } },
    { name: 'ReasonDamage', label: 'Reason of Damage', options: { filter: true, sort: true } },
    { name: 'damageBy', label: 'Damage By', options: {
      filter: false, sort: true,
      customBodyRender: (value) => {
        if (Array.isArray(value) && value.length > 0) {
          return value.map(({ name, armyId }) => `${name} (${armyId})`).join(', ');
        }
        return 'N/A';
      }
    }},
    { name: 'damageDate', label: 'Date of Damage', options: { filter: false, sort: true } },
    { name: 'retundDate', label: 'Return to the Workshop', options: {
      filter: true, sort: true,
      customBodyRender: (value, tableMeta) => {
        if (!value) {
          const rowData = dailyRecord[tableMeta.rowIndex];
          return (
            <Button 
              variant="primary" 
              style={{ 
                backgroundColor: '#1f372f', 
                boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.6)', 
                border: 'none' 
              }} 
              onClick={() => handleReturnButtonClick(rowData)}
            >
              Return
            </Button>
          );
        }
        return value;
      }
    }},
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
      <Container style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginTop: '10px' }}>
        <Button 
          variant="primary" 
          onClick={() => toggleModal('CO')} 
          style={{ 
            backgroundColor: '#1f372f', 
            boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.6)', 
            border: 'none', 
            marginLeft: '10px' 
          }}
        >
          Approval CO
        </Button>
        <Button 
          variant="primary" 
          onClick={() => toggleModal('JCO')} 
          style={{ 
            backgroundColor: '#1f372f', 
            boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.6)', 
            border: 'none', 
            marginLeft: '10px' 
          }}
        >
          Approval JCO
        </Button>
      </Container>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '20px' }}>
        <Table columns={columns} data={dailyRecord} options={options} records={"Damage Weapon Records"} />
      </div>
      <Modal 
        show={isModalOpen} 
        onHide={() => setIsModalOpen(false)} 
        dialogClassName="dark-modal" 
        contentClassName="bg-dark text-white"
        style={{ backdropFilter: 'blur(5px)' }} 
      >
        <div style={{ 
          backgroundColor: '#1c170ed2', 
          boxShadow: '0 0 20px 5px rgba(255, 255, 255, 0.6)', 
          border: 'none', 
          backdropFilter: 'blur(5px)'
        }}>
          <Modal.Header 
            closeButton 
            style={{ 
              backgroundColor: '#1c170eaa', 
              color: '#fff', 
              borderBottom: '1px solid white' 
            }}
          >
            <Modal.Title>Authentication Required</Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ 
            backgroundColor: '#1c170ed2', 
            color: '#fff' 
          }}>
            <Form>
              <Form.Group controlId="formUsername">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  style={{ 
                    backgroundColor: '#2a2a2a', 
                    color: '#fff', 
                    borderColor: '#2a2a2a' 
                  }}
                />
              </Form.Group>
              <Form.Group controlId="formPassword" style={{ marginTop: '10px' }}>
                <Form.Label>Password</Form.Label>
                <div style={{ position: 'relative' }}>
                  <Form.Control
                    type={passwordVisible ? 'text' : 'password'} // Toggle password visibility
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ 
                      backgroundColor: '#2a2a2a', 
                      color: '#fff', 
                      borderColor: '#2a2a2a' 
                    }}
                  />
                  <div
                    onClick={() => setPasswordVisible(!passwordVisible)}
                    style={{
                      position: 'absolute',
                      top: '50%',
                      right: '10px',
                      transform: 'translateY(-50%)',
                      cursor: 'pointer',
                      color: '#ffffff'
                    }}
                  >
                    {passwordVisible ? <FaEyeSlash /> : <FaEye />} {/* Toggle icon */}
                  </div>
                </div>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer style={{ 
            backgroundColor: '#1c170eaa', 
            borderTop: '1px solid white' 
          }}>
            <Button 
              variant="secondary" 
              onClick={() => setIsModalOpen(false)} 
              style={{ 
                backgroundColor: '#1f372f', 
                border: 'none' 
              }}
            >
              Cancel
            </Button>
            <Button 
              variant="primary" 
              onClick={handleAuthSubmit} 
              style={{ 
                backgroundColor: '#1f372f', 
                border: 'none' 
              }}
            >
              Submit
            </Button>
          </Modal.Footer>
        </div>
      </Modal>
    </>
  );
};

export default DamageWeaponRecords;
