import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { getDashbord } from '../../../Services/ApiServices';
import CountUp from 'react-countup';

const buttonStyle = {
    background: 'linear-gradient(45deg, #1f372f, #1c170ed2)',
    color: 'white',
    border: 'none',
    fontWeight: 'bold',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    transition: 'all 0.3s ease-in-out',
    position: 'relative'
};

const buttonHoverStyle = {
    boxShadow: '0 0 20px rgba(0, 255, 0, 0.5)', // Green glow effect
    transform: 'scale(1.05)'
};

const cardStyle = {
    cursor: 'pointer',
    background: '#1c170ed2',
    color: 'white',
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.3)',
    borderRadius: '12px',
    transition: 'transform 0.3s, box-shadow 0.3s',
    transform: 'scale(1)' // Add the default transform property here
};

const cardHoverStyle = {
    transform: 'scale(1.05)',
    boxShadow: '0 0 20px rgba(255, 255, 255, 0.8)' // White glow effect
};

const Dashboard = () => {
    const [dataCounts, setDataCounts] = useState({
        totalWeapon: 0,
        totalCategories: 0,
        totalSubcategories: 0,
        available: 0,
        issued: 0,
        damaged: 0,
    });

    useEffect(() => {
        (async () => {
            try {
                const counts = await getDashbord();
                console.log('Dashboard counts:', counts); // Check if counts has the expected structure
                if (counts) {
                    setDataCounts({
                        totalWeapon: counts.totalWeapon || 0,
                        totalCategories: counts.totalCategories || 0,
                        totalSubcategories: counts.totalSubcategories || 0,
                        available: counts.available || 0,
                        issued: counts.issued || 0,
                        damaged: counts.damaged || 0
                    });
                }
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            }
        })();
    }, []);

    return (
        <Container className="mt-4">
            <Row className="mb-4">
                <Col xs={12} className="text-center">
                    <img src='/logo.png' alt="Logo" style={{ height: '60px', marginBottom: '10px' }} />
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'white', textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)' }}>
                        Weapon Management System
                    </h1>
                </Col>
            </Row>
            <Row className="mb-4 text-center">
                <Col xs={12}>
                    <h2 style={{ color: 'white', marginBottom: '20px' }}>Quick Links</h2>
                </Col>
                <Col md={3} className="mb-3">
                    <Link to="/dailyrecords" style={{ textDecoration: 'none' }}>
                        <Button
                            className="w-100"
                            variant="light"
                            style={buttonStyle}
                            onMouseOver={(e) => {
                                e.currentTarget.style.boxShadow = buttonHoverStyle.boxShadow;
                                e.currentTarget.style.transform = buttonHoverStyle.transform;
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.boxShadow = buttonStyle.boxShadow;
                                e.currentTarget.style.transform = buttonStyle.transform;
                            }}
                        >
                            Daily Weapon Issue Entry
                        </Button>
                    </Link>
                </Col>
                <Col md={3} className="mb-3">
                    <Link to="/addweapondetail" style={{ textDecoration: 'none' }}>
                        <Button
                            className="w-100"
                            variant="light"
                            style={buttonStyle}
                            onMouseOver={(e) => {
                                e.currentTarget.style.boxShadow = buttonHoverStyle.boxShadow;
                                e.currentTarget.style.transform = buttonHoverStyle.transform;
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.boxShadow = buttonStyle.boxShadow;
                                e.currentTarget.style.transform = buttonStyle.transform;
                            }}
                        >
                            Add New Weapon
                        </Button>
                    </Link>
                </Col>
                <Col md={3} className="mb-3">
                    <Link to="/assignweapon" style={{ textDecoration: 'none' }}>
                        <Button
                            className="w-100"
                            variant="light"
                            style={buttonStyle}
                            onMouseOver={(e) => {
                                e.currentTarget.style.boxShadow = buttonHoverStyle.boxShadow;
                                e.currentTarget.style.transform = buttonHoverStyle.transform;
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.boxShadow = buttonStyle.boxShadow;
                                e.currentTarget.style.transform = buttonStyle.transform;
                            }}
                        >
                            Allot Weapon to Soldier
                        </Button>
                    </Link>
                </Col>
                <Col md={3} className="mb-3">
                    <Link to="/returnweapon" style={{ textDecoration: 'none' }}>
                        <Button
                            className="w-100"
                            variant="light"
                            style={buttonStyle}
                            onMouseOver={(e) => {
                                e.currentTarget.style.boxShadow = buttonHoverStyle.boxShadow;
                                e.currentTarget.style.transform = buttonHoverStyle.transform;
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.boxShadow = buttonStyle.boxShadow;
                                e.currentTarget.style.transform = buttonStyle.transform;
                            }}
                        >
                            Return Weapon from Soldier
                        </Button>
                    </Link>
                </Col>
            </Row>

            {/* Divider Section */}
            <Row>
                <Col xs={12} className="text-center mb-4">
                    <hr style={{ borderTop: '2px solid #1c170ed2', width: '80%', margin: '0 auto' }} />
                </Col>
            </Row>

            <Row>
                <Col md={4} className="mb-4">
                    <Link to="/overallrecord" style={{ textDecoration: 'none' }}>
                        <Card
                            className="text-center"
                            style={cardStyle}
                            onMouseEnter={e => {
                                e.currentTarget.style.transform = cardHoverStyle.transform;
                                e.currentTarget.style.boxShadow = cardHoverStyle.boxShadow;
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.transform = cardStyle.transform;
                                e.currentTarget.style.boxShadow = cardStyle.boxShadow;
                            }}
                        >
                            <Card.Body>
                                <Card.Title style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Total Weapons</Card.Title>
                                <Card.Text style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                                    <CountUp end={dataCounts.totalWeapon} duration={2} />
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Link>
                </Col>
                <Col md={4} className="mb-4">
                    <Link to="/addcategory" style={{ textDecoration: 'none' }}>
                        <Card
                            className="text-center"
                            style={cardStyle}
                            onMouseEnter={e => {
                                e.currentTarget.style.transform = cardHoverStyle.transform;
                                e.currentTarget.style.boxShadow = cardHoverStyle.boxShadow;
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.transform = cardStyle.transform;
                                e.currentTarget.style.boxShadow = cardStyle.boxShadow;
                            }}
                        >
                            <Card.Body>
                                <Card.Title style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Total Categories</Card.Title>
                                <Card.Text style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                                    <CountUp end={dataCounts.totalCategories} duration={2} />
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Link>
                </Col>
                <Col md={4} className="mb-4">
                    <Link to="/addsubcategory" style={{ textDecoration: 'none' }}>
                        <Card
                            className="text-center"
                            style={cardStyle}
                            onMouseEnter={e => {
                                e.currentTarget.style.transform = cardHoverStyle.transform;
                                e.currentTarget.style.boxShadow = cardHoverStyle.boxShadow;
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.transform = cardStyle.transform;
                                e.currentTarget.style.boxShadow = cardStyle.boxShadow;
                            }}
                        >
                            <Card.Body>
                                <Card.Title style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Total Subcategories</Card.Title>
                                <Card.Text style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                                    <CountUp end={dataCounts.totalSubcategories} duration={2} />
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Link>
                </Col>
            </Row>
            <Row>
                <Col md={4} className="mb-4">
                    <Link to="/overallrecord" style={{ textDecoration: 'none' }}>
                        <Card
                            className="text-center"
                            style={cardStyle}
                            onMouseEnter={e => {
                                e.currentTarget.style.transform = cardHoverStyle.transform;
                                e.currentTarget.style.boxShadow = cardHoverStyle.boxShadow;
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.transform = cardStyle.transform;
                                e.currentTarget.style.boxShadow = cardStyle.boxShadow;
                            }}
                        >
                            <Card.Body>
                                <Card.Title style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Available</Card.Title>
                                <Card.Text style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                                    <CountUp end={dataCounts.available} duration={2} />
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Link>
                </Col>
                <Col md={4} className="mb-4">
                    <Link to="/overallrecord" style={{ textDecoration: 'none' }}>
                        <Card
                            className="text-center"
                            style={cardStyle}
                            onMouseEnter={e => {
                                e.currentTarget.style.transform = cardHoverStyle.transform;
                                e.currentTarget.style.boxShadow = cardHoverStyle.boxShadow;
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.transform = cardStyle.transform;
                                e.currentTarget.style.boxShadow = cardStyle.boxShadow;
                            }}
                        >
                            <Card.Body>
                                <Card.Title style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Issued</Card.Title>
                                <Card.Text style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                                    <CountUp end={dataCounts.issued} duration={2} />
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Link>
                </Col>
                <Col md={4} className="mb-4">
                    <Link to="/damagedweapons" style={{ textDecoration: 'none' }}>
                        <Card
                            className="text-center"
                            style={cardStyle}
                            onMouseEnter={e => {
                                e.currentTarget.style.transform = cardHoverStyle.transform;
                                e.currentTarget.style.boxShadow = cardHoverStyle.boxShadow;
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.transform = cardStyle.transform;
                                e.currentTarget.style.boxShadow = cardStyle.boxShadow;
                            }}
                        >
                            <Card.Body>
                                <Card.Title style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Damaged</Card.Title>
                                <Card.Text style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                                    <CountUp end={dataCounts.damaged} duration={2} />
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Link>
                </Col>
            </Row>
        </Container>
    );
};

export default Dashboard;
