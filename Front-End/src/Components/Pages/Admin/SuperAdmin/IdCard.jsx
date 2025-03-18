import React, { useRef } from 'react';
import { Card, Button } from 'react-bootstrap';
import { useReactToPrint } from 'react-to-print';
import * as htmlToImage from 'html-to-image';
import download from 'downloadjs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

const IdCard = ({ name, room, role, userName, password }) => {
  const cardRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => cardRef.current,
  });

  const handleSaveAsJPG = () => {
    htmlToImage.toJpeg(cardRef.current, { quality: 0.95 }).then((dataUrl) => {
      download(dataUrl, 'id-card.jpg');
    });
  };

  return (
    <div style={{
        width: '100%',
        maxWidth: '400px',
        margin: 'auto',
        padding: '20px',
        borderRadius: '12px',
        background: 'linear-gradient(135deg, #1f372f, #2a3c3d)',
        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.3)',
      }}>
      <Card 
        ref={cardRef}
        style={{
          backgroundColor: '#ffffff',
          color: '#333',
          borderRadius: '12px',
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.2)',
          padding: '20px',
          textAlign: 'left',
        }}
        className="m-3"
      >
        <Card.Body>
          <Card.Title style={{ marginBottom: '20px', fontSize: '1.5rem', fontWeight: 'bold', textAlign: 'center' }}>
            <FontAwesomeIcon icon={faUser} style={{ marginRight: '10px' }} />
            ID Card
          </Card.Title>
          <div style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <strong style={{ flex: '0 0 40%' }}>Name:</strong>
            <span style={{ flex: '1', textAlign: 'left', marginLeft: '10px' }}>{name}</span>
          </div>
          <div style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <strong style={{ flex: '0 0 40%' }}>Room:</strong>
            <span style={{ flex: '1', textAlign: 'left', marginLeft: '10px' }}>{room}</span>
          </div>
          <div style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <strong style={{ flex: '0 0 40%' }}>Role:</strong>
            <span style={{ flex: '1', textAlign: 'left', marginLeft: '10px' }}>{role}</span>
          </div>
          <div style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <strong style={{ flex: '0 0 40%' }}>Username:</strong>
            <span style={{ flex: '1', textAlign: 'left', marginLeft: '10px' }}>{userName}</span>
          </div>
          <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <strong style={{ flex: '0 0 40%' }}>Password:</strong>
            <span style={{ flex: '1', textAlign: 'left', marginLeft: '10px' }}>{password}</span>
          </div>
        </Card.Body>
      </Card>
      <div className="d-flex justify-content-around mt-3">
        <Button
          variant="primary"
          onClick={handlePrint}
          style={{ backgroundColor: '#007bff', border: 'none', borderRadius: '5px', padding: '10px 20px' }}
        >
          Print
        </Button>
        <Button
          variant="secondary"
          onClick={handleSaveAsJPG}
          style={{ backgroundColor: '#6c757d', border: 'none', borderRadius: '5px', padding: '10px 20px' }}
        >
          Save as JPG
        </Button>
      </div>
    </div>
  );
};

export default IdCard;
