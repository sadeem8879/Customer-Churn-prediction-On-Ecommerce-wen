// import React, { useState } from 'react';
// import { Container, Row, Col } from 'react-bootstrap';
// import Button from 'react-bootstrap/Button';
// import Form from 'react-bootstrap/Form';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';

// const AdminLogin = () => {
//     const [credentials, setCredentials] = useState({ username: '', password: '' });
//     const [message, setMessage] = useState('');
//     const navigate = useNavigate();

//     const handleChange = (e) => {
//         setCredentials({ ...credentials, [e.target.name]: e.target.value });
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         try {
//             const response = await axios.post('http://localhost:8080/admin-login', credentials);
//             localStorage.setItem('isAdminAuthenticated', 'true');
//             localStorage.setItem('userId', response.data.userId);
//             navigate('/admin');
//         } catch (error) {
//             setMessage(error.response?.data?.msg || 'Login Failed');
//         }
//     };

//     return (
//         <Container className="d-flex justify-content-center align-items-center vh-100">
//             <Row>
//                 <Col lg={12} md={12} sm={12} className="shadow pt-2">
//                     <h3 className="text-center mt-2">Admin Login</h3>
//                     {message && <div className="alert alert-danger">{message}</div>}

//                     <Form onSubmit={handleSubmit}>
//                         <Form.Group className="mb-3">
//                             <Form.Label>Admin Username</Form.Label>
//                             <Form.Control
//                                 type="text"
//                                 name="username"
//                                 placeholder="Enter Username"
//                                 value={credentials.username}
//                                 onChange={handleChange}
//                             />
//                         </Form.Group>

//                         <Form.Group className="mb-3">
//                             <Form.Label>Password</Form.Label>
//                             <Form.Control
//                                 type="password"
//                                 name="password"
//                                 placeholder="Enter Password"
//                                 value={credentials.password}
//                                 onChange={handleChange}
//                             />
//                         </Form.Group>
//                         <Form.Group className="mb-3">
//                             <Form.Label>Admin Username</Form.Label>
//                             <Form.Control
//                                 type="text"
//                                 name="secretkey"
//                                 placeholder="Enter SecretKey"
//                                 value={credentials.secretkey}
//                                 onChange={handleChange}
//                             />
//                         </Form.Group>
//                         <Button type="submit" variant="primary" className="w-100">
//                             Login
//                         </Button>
//                     </Form>
//                 </Col>
//             </Row>
//         </Container>
//     );
// };

// export default AdminLogin;
import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AdminLogin = () => {
    const [credentials, setCredentials] = useState({ username: "", password: "", secretkey: "" });
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:8080/admin-login", credentials);
            localStorage.setItem("isAdminAuthenticated", "true");
            // localStorage.setItem("userId", response.data.userId);
            localStorage.setItem("adminId", response.data.adminId);

            navigate("/admin");
        } catch (error) {
            setMessage(error.response?.data?.msg || "Login Failed");
        }
    };

    return (
        <Container className="d-flex justify-content-center align-items-center vh-100">
            <Row>
                <Col lg={12} md={12} sm={12} className="shadow pt-2">
                    <h3 className="text-center mt-2">Admin Login</h3>
                    {message && <div className="alert alert-danger">{message}</div>}

                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Admin Username</Form.Label>
                            <Form.Control
                                type="text"
                                name="username"
                                placeholder="Enter Username"
                                value={credentials.username}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                name="password"
                                placeholder="Enter Password"
                                value={credentials.password}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Secret Key</Form.Label>
                            <Form.Control
                                type="password"
                                name="secretkey"
                                placeholder="Enter Secret Key"
                                value={credentials.secretkey}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Button type="submit" variant="primary" className="w-100">
                            Login
                        </Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
};

export default AdminLogin;
