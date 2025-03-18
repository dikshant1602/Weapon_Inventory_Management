import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button } from 'react-bootstrap'; // Import Bootstrap components

const Footer = () => {
  const [showModal, setShowModal] = useState(false);
  const currentYear = new Date().getFullYear();

  const footerStyle = {
    backgroundColor: '#1c170ed2',
    padding: '10px 0',
    textAlign: 'center',
    position: 'relative',
    overflow: 'hidden',
  };

  const textStyle = {
    margin: 0,
    fontSize: '14px',
    color: '#fff',
    display: 'inline-block',
    position: 'relative',
    fontWeight: 'bold',
    background: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.7) 50%, rgba(255,255,255,0) 100%)',
    backgroundSize: '200% 100%',
    animation: 'shine 3s infinite',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    cursor: 'pointer' // Change cursor to pointer to indicate clickability
  };

  const keyframes = `
    @keyframes shine {
      0% {
        background-position: 100% 0;
      }
      100% {
        background-position: -100% 0;
      }
    }
  `;

  const modalDialogStyle = {
    backgroundColor: '#1c170ed2',
    boxShadow: '0 0 20px 5px rgba(255, 255, 255, 0.8)',
    border: 'none',
  };

  const modalHeaderStyle = {
    backgroundColor: '#1c170eaa',
    color: '#fff',
    borderBottom: '1px solid white',
  };

  const modalBodyStyle = {
    backgroundColor: '#1c170ed2',
    color: '#fff',
  };

  const modalFooterStyle = {
    backgroundColor: '#1c170eaa',
    borderTop: '1px solid white',
  };

  return (
    <div style={footerStyle}>
      <style>
        {keyframes}
      </style>
      <p style={textStyle} onClick={() => setShowModal(true)}>
        © {currentYear} MLSU BCA VIth SEM Students
      </p>

      {/* Modal */}
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        dialogClassName="model-dark"
        style={{ backdropFilter: 'blur(5px)' }}
      >
        <div style={modalDialogStyle}>
          <Modal.Header closeButton style={modalHeaderStyle}>
            <Modal.Title>Developed By:</Modal.Title>
          </Modal.Header>
          <Modal.Body style={modalBodyStyle}>
            <p>Mohammed Kaif Hussain</p>
            <p>Nayan Mehta</p>
            <p>Anshul Menaria</p>
            <p>Dheeraj Salvi</p>
          </Modal.Body>
          <Modal.Footer style={modalFooterStyle}>
            <Button 
              variant="secondary" 
              onClick={() => setShowModal(false)} 
              style={{ backgroundColor: '#1F372F', border: 'none' }}
            >
              Close
            </Button>
          </Modal.Footer>
        </div>
      </Modal>
    </div>
  );
};

export default Footer;
