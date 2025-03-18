import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { fetchRoomIncharge, superLogin } from '../../../Services/ApiServices';
import ChangePassword from './ChangePassword';
import AddRoomIncharge from '../WeaponsEntry/AssignWeapon/Add-Incharge';
import Sign from './SuperAdmin/Sign';
import TableComponent from './TableComponent'; // Adjust the import path as necessary
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus, faSignature } from '@fortawesome/free-solid-svg-icons';
import { Widgets } from '@mui/icons-material';

function ViewIncharge() {
    const [rooms, setRooms] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [showModal1, setShowModal1] = useState(false);
    const [showModal2, setShowModal2] = useState(false);
    const [roomNo, setRoomNo] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        (async () => {
            try {
                const response = await fetchRoomIncharge();
                setRooms(response);
            } catch (error) {
                alert(`Error fetching room incharges: ${error.message}`);
            }
        })();
    }, []);

    const handleChange = (roomNo) => {
        setRoomNo(roomNo);
        setShowModal1(false);
        setShowModal2(false);
        setShowModal(true);
    };

    // Function to handle search
    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    // Function to handle removing a room
    const handleRemove = (index) => {
        if (window.confirm(`Are you sure you want to remove room ${rooms[index].roomNo}?`)) {
            const updatedRooms = [...rooms];
            updatedRooms.splice(index, 1);
            setRooms(updatedRooms);
        }
    };

    // Function to handle login
    const handleLogin = async (roomNoAssigned) => {
        if (!window.confirm(`Upon clicking OK, you will be logged in as the in-charge of room "${roomNoAssigned}" , and you will be logged out as the super admin. Do you wish to proceed?`)) {
            return;
        }

        try {
            const response = await superLogin(roomNoAssigned);
            const { logedAdmin, accessToken, refreshToken } = response;

            if (logedAdmin) {
                localStorage.clear();
                localStorage.setItem('logedAdmin', JSON.stringify(logedAdmin));
                localStorage.setItem('accessToken', accessToken);
                localStorage.setItem('refreshToken', refreshToken);

                if (logedAdmin.isSuperAdmin) {
                    navigate('/superAdmin');
                } else {
                    navigate('/adminDashboard');
                    // Force refresh of the adminDashboard page
                    window.location.reload();
                }

                alert('Login successful!');
            }
        } catch (error) {
            alert(`Error during login: ${error.message}`);
        }
    };

    const filteredRooms = rooms.filter(room =>
        room.roomNoAssigned.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const columns = React.useMemo(
        () => [
            { Header: 'Room No', accessor: 'roomNoAssigned' },
            { Header: 'Admin', accessor: 'adminName' },
            {
                Header: 'Actions',
                accessor: 'actions',
                Cell: ({ row }) => (
                    <div>
                        <button
                            className="btn btn-primary btn-sm mx-1"
                            style={{ backgroundColor: '#1f372f', border: 'none', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)' }}
                            onClick={() => handleChange(row.original.roomNoAssigned)}
                        >
                            Change Password
                        </button>
                        <button
                            type="button"
                            className="btn btn-warning btn-sm mx-1"
                            style={{ backgroundColor: '#2b242ed2', border: 'none', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)', color: '#fff' }}
                            onClick={() => handleLogin(row.original.roomNoAssigned)}
                        >
                            Login
                        </button>
                    </div>
                )
            }
        ],
        [handleChange, handleLogin]
    );

    const data = React.useMemo(() => filteredRooms, [filteredRooms]);

    const overlayStyle = {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
        backdropFilter: 'blur(10px)', // Apply blur effect
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000
    };

    const modalStyle = {
        animation: 'zoomIn 0.3s ease-out',
        transform: 'scale(1)',
        opacity: 1,
        width: '100%'
    };

    const keyframesStyle = `
        @keyframes zoomIn {
            from {
                transform: scale(0.5);
                opacity: 0;
            }
            to {
                transform: scale(1);
                opacity: 1;
            }
        }
    `;

    return (
        <>
            <style>
                {keyframesStyle}
            </style>
            <div className="container mt-5">
                <div className="text-center mb-4">
                    <img src="/logo.png" alt="Logo" style={{ height: '50px' }} />
                    <h1>Weapon Management System</h1>
                </div>
                <div className="card shadow bg-dark text-white position-relative">
                    <div className="card-header d-flex justify-content-between align-items-center" style={{ backgroundColor: '#1c170ed2' }}>
                        <h2 className="text-center mb-0">Admin Data</h2>
                        <div className="d-flex">
                            <button
                                type="button"
                                className="btn btn-success btn-sm mx-1"
                                style={{ backgroundColor: '#1f372f', border: 'none', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)' }}
                                onClick={() => { setShowModal1(true); setShowModal(false); setShowModal2(false); }}
                            >
                                <FontAwesomeIcon icon={faUserPlus} style={{ marginRight: '5px' }} />
                                Add Room Incharge
                            </button>
                            <button
                                type="button"
                                className="btn btn-success btn-sm mx-1"
                                style={{ backgroundColor: '#1f372f', border: 'none', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)' }}
                                onClick={() => { setShowModal1(false); setShowModal(false); setShowModal2(true); }}
                            >
                                <FontAwesomeIcon icon={faSignature} style={{ marginRight: '5px' }} />
                                Manage signature CO/JCO/NCO
                            </button>
                        </div>
                    </div>
                    <div className="card-body">
                        <div className="input-group mb-3">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Search by Room No"
                                value={searchTerm}
                                onChange={handleSearch}
                                style={{ backgroundColor: '#555', color: '#fff', borderColor: '#666' }}
                            />
                        </div>
                        <TableComponent columns={columns} data={data} />
                    </div>
                    {showModal1 && <div className="overlay" style={overlayStyle}>
                        <div style={modalStyle}>
                            <AddRoomIncharge setShowModal1={setShowModal1} />
                        </div>
                    </div>}
                    {showModal2 && <div className="overlay" style={overlayStyle}>
                        <div style={modalStyle}>
                            <Sign setShowModal2={setShowModal2} />
                        </div>
                    </div>}
                    {showModal && <div className="overlay" style={overlayStyle}>
                        <div style={modalStyle}>
                            <ChangePassword roomNo={roomNo} setShowModal={setShowModal} />
                        </div>
                    </div>}
                </div>
            </div>
        </>
    );
}

export default ViewIncharge;
