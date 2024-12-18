import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_ENDPOINT } from '../Api';
import "bootstrap/dist/css/bootstrap.css";
import { Container, Row, Col, Navbar, Form, Button } from 'react-bootstrap';
import { jwtDecode } from 'jwt-decode';


function Login() {
  const [username, setUsername] = useState(''); // Use username as per your backend
  const [passwordx, setPasswordx] = useState(''); // Use passwords instead of passwordx
  
  const [user, setUser] = useState(null);
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => { 
    const fetchUser = async () => {
      try {
        const response = JSON.parse(localStorage.getItem('token'))
        setUser(response.data);

        navigate("/dashboard");

      } catch (error) {
        navigate("/login");
      }
    };

    fetchUser();
    
  }, []);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Send username and passwords (to match backend's expected keys)
      const response = await axios.post(`${API_ENDPOINT}/auth/login`, {
        username,   // Sending username
        passwordsx  // Sending passwords to match backend
      });

      // Store the token from the backend in localStorage
      localStorage.setItem('token', JSON.stringify(response.data.token));

      setError(''); // Clear previous error
      navigate('/dashboard'); // Redirect to the dashboard
    } catch (error) {
      setError('Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar bg="success" variant="dark">
        <Container>
          <Navbar.Brand>Amira</Navbar.Brand>
        </Container>
      </Navbar>

      {/* Welcome Message Outside the Box */}
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <div className="text-center mb-5">
          <h3>Welcome</h3>
          <p>
            Find your perfect home with us. Login to access available listings, manage your preferences, and start your rental journey today.
          </p>
        </div>

        {/* Login Form in Box */}
        <div className="p-5 border rounded shadow" style={{ maxWidth: '500px', width: '100%' }}>
          <Row>
            <Col md={12}>
              <h4 className="text-center mb-4">Login</h4>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formUsername">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter password"
                    value={passwordx}
                    onChange={(e) => setPasswordx(e.target.value)} // Set passwords here
                    required
                  />
                </Form.Group>

                {error && <p className="text-danger">{error}</p>}

                <Button variant="primary" type="submit" disabled={loading} className="w-100">
                  {loading ? 'Logging in...' : 'Login'}
                </Button>
              </Form>
            </Col>
          </Row>
        </div>
      </Container>
    </>
  );
}

export default Login;