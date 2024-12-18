import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';
import axios from 'axios';
import { API_ENDPOINT } from '../Api';
import { Dropdown, Button, Card, Col, Container, Form, Modal, Nav, Navbar, NavDropdown, Row, Table } from 'react-bootstrap';
import Swal from 'sweetalert2';

function Dashboard() {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [showUsersModal, setShowUsersModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showReadModal, setShowReadModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newUser, setNewUser] = useState({ fullname: '', age: '', username: '', passwordx: '' });
  const [editUser, setEditUser] = useState({ fullname: '', age: '', username: '', passwordx: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDecodedUserID = async () => {
      try {
        const response = JSON.parse(localStorage.getItem('token'));
        if (response && response.token) {
          const decodedToken = jwtDecode(response.token);
          setUser(decodedToken);
        } else {
          navigate('/login');
        }
      } catch (error) {
        navigate('/login');
      }
    };

    fetchDecodedUserID();
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = JSON.parse(localStorage.getItem('token'))?.token;
      const headers = { Authorization: token };
      const { data } = await axios.get(`${API_ENDPOINT}/user`, { headers });
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      const token = JSON.parse(localStorage.getItem('token'))?.token;
      const headers = { Authorization: token };
      await axios.post(`${API_ENDPOINT}/user`, newUser, { headers });
      setShowCreateModal(false);
      fetchUsers();
      Swal.fire({ icon: 'success', text: 'User created successfully!' });
    } catch (error) {
      console.error('Error creating user:', error);
      Swal.fire({
        icon: 'error',
        text: error.response?.data?.message || 'An error occurred.',
      });
    }
  };

  const handleEditUser = async (e) => {
    e.preventDefault();
    try {
      const token = JSON.parse(localStorage.getItem('token'))?.token;
      const headers = { Authorization: token };
      await axios.put(`${API_ENDPOINT}/user/${selectedUser.id}`, editUser, { headers });
      setShowEditModal(false);
      fetchUsers();
      Swal.fire({ icon: 'success', text: 'User updated successfully!' });
    } catch (error) {
      console.error('Error updating user:', error);
      Swal.fire({
        icon: 'error',
        text: error.response?.data?.message || 'An error occurred.',
      });
    }
  };

  const handleDeleteUser = async (id) => {
    const isConfirm = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    });

    if (!isConfirm.isConfirmed) return;

    try {
      const token = JSON.parse(localStorage.getItem('token'))?.token;
      const headers = { Authorization: token };
      await axios.delete(`${API_ENDPOINT}/user/${id}`, { headers });
      fetchUsers();
      Swal.fire({ icon: 'success', text: 'User deleted successfully!' });
    } catch (error) {
      console.error('Error deleting user:', error);
      Swal.fire({
        icon: 'error',
        text: error.response?.data?.message || 'An error occurred.',
      });
    }
  };

  return (
    <>
      <Navbar bg="primary" data-bs-theme="dark">
        <Container>
          <Navbar.Brand href="#home">JPado</Navbar.Brand>
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Button variant="light" className="me-2" onClick={() => setShowUsersModal(true)}>
                Users
              </Button>
              <NavDropdown
                title={<img src="person-fill.svg" alt="User Icon" style={{ width: '30px', height: '30px', borderRadius: '50%' }} />}
                id="basic-nav-dropdown"
                align="end"
              >
                <NavDropdown.Item eventKey="disabled" disabled>
                  {user ? `User: ${user.username}` : 'Guest'}
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="#">Account</NavDropdown.Item>
                <NavDropdown.Item href="#">Settings</NavDropdown.Item>
                <NavDropdown.Item href="#" onClick={() => navigate('/login')}>
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container className="mt-5">
        <Row className="d-flex flex-wrap justify-content-center">
          {[...Array(7)].map((_, index) => (
            <Col xs={12} sm={6} md={4} lg={3} className="mb-4" key={index}>
              <Card style={{ width: '100%' }}>
                <Card.Img variant="top" src="MLBB.png" />
                <Card.Body>
                  <Card.Title>House {index + 1}</Card.Title>
                  <Button variant="primary">Rent</Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      {/* Users Modal */}
      <Modal show={showUsersModal} onHide={() => setShowUsersModal(false)} backdrop="static" fullscreen>
        <Modal.Header closeButton>
          <Modal.Title>Users</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>ID</th>
                <th>Full Name</th>
                <th>Age</th>
                <th>Username</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.fullname}</td>
                  <td>{user.age}</td>
                  <td>{user.username}</td>
                  <td>
                    <Button
                      variant="info"
                      onClick={() => {
                        setSelectedUser(user);
                        setShowReadModal(true);
                      }}
                    >
                      Read
                    </Button>{' '}
                    <Button
                      variant="warning"
                      onClick={() => {
                        setSelectedUser(user);
                        setEditUser({
                          fullname: user.fullname,
                          age: user.age,
                          username: user.username,
                          passwordx: '',
                        });
                        setShowEditModal(true);
                      }}
                    >
                      Update
                    </Button>{' '}
                    <Button variant="danger" onClick={() => handleDeleteUser(user.id)}>
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Button variant="success" onClick={() => setShowCreateModal(true)} className="mt-3">
            Create User
          </Button>
        </Modal.Body>
      </Modal>

      {/* Create User Modal */}
      <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Create User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleCreateUser}>
            <Form.Group controlId="formFullname">
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                type="text"
                value={newUser.fullname}
                onChange={(e) => setNewUser({ ...newUser, fullname: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group controlId="formAge">
              <Form.Label>Age</Form.Label>
              <Form.Control
                type="text"
                value={newUser.age}
                onChange={(e) => setNewUser({ ...newUser, age: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group controlId="formUsername">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                value={newUser.username}
                onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group controlId="formPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                value={newUser.passwordx}
                onChange={(e) => setNewUser({ ...newUser, passwordx: e.target.value })}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="mt-3">
              Create User
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Edit User Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleEditUser}>
            <Form.Group controlId="formFullname">
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                type="text"
                value={editUser.fullname}
                onChange={(e) => setEditUser({ ...editUser, fullname: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group controlId="formAge">
              <Form.Label>Age</Form.Label>
              <Form.Control
                type="text"
                value={editUser.age}
                onChange={(e) => setEditUser({ ...editUser, age: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group controlId="formUsername">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                value={editUser.username}
                onChange={(e) => setEditUser({ ...editUser, username: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group controlId="formPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                value={editUser.passwordx}
                onChange={(e) => setEditUser({ ...editUser, passwordx: e.target.value })}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="mt-3">
              Update User
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Read User Modal */}
      <Modal show={showReadModal} onHide={() => setShowReadModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>User Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p><strong>Full Name:</strong> {selectedUser?.fullname}</p>
          <p><strong>Age:</strong> {selectedUser?.age}</p>
          <p><strong>Username:</strong> {selectedUser?.username}</p>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default Dashboard;