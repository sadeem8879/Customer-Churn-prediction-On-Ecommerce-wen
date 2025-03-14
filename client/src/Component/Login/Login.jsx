// import { Container, Row, Col } from 'react-bootstrap';
// import React, { useState } from 'react';
// import Form from 'react-bootstrap/Form';
// import { useNavigate } from 'react-router-dom';
// import axios from "axios";
// import { Button } from 'react-bootstrap';

// const Login = ({ handleLogin }) => {
//     const [username, setUsername] = useState("");
//     const [password, setPassword] = useState("");
//     const [message, setMessage] = useState("");
//     const navigate = useNavigate();

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         if (!username || !password) {
//             setMessage('All fields are required.');
//             return;
//         }

//         try {
//             const response = await axios.post(
//                 'http://localhost:8080/login',
//                 { username, password },
//                 { withCredentials: true, headers: { 'Content-Type': 'application/json' } }
//             );

//             setMessage(response.data.msg);
//             const userId = response.data.userId;

//             if (userId) {
//                 localStorage.setItem('userId', userId);
//                 handleLogin(userId); // Calls API to track login too
//                 body: JSON.stringify({ userId }), // Send userId in request body
//                     navigate('/home');
//             } else {
//                 setMessage("User ID not found in response.");
//             }
//         } catch (error) {
//             console.error('Login error:', error.response?.data || error.message);
//             setMessage(error.response?.data?.msg || "Login failed.");
//         }
//     };
//     // const handleSubmit = async (e) => {
//     //     e.preventDefault();

//     //     if (!username || !password) {
//     //         setMessage('All fields are required.');
//     //         return;
//     //     }

//     //     try {
//     //         const response = await axios.post('http://localhost:8080/login', { username, password });

//     //         setMessage(response.data.msg);
//     //         const userId = response.data.userId;
//     //         const role = response.data.role;

//     //         if (userId) {
//     //             localStorage.setItem('userId', userId);
//     //             localStorage.setItem('role', role);
//     //             navigate(role === "admin" ? "/admin-dashboard" : "/home");
//     //         } else {
//     //             setMessage("User ID not found in response.");
//     //         }
//     //     } catch (error) {
//     //         console.error('Login error:', error.response?.data || error.message);
//     //         setMessage(error.response?.data?.msg || "Login failed.");
//     //     }
//     // };


//     return (
//         <div>

//             <Container className="d-flex justify-content-center align-items-center vh-100" style={{ backgroundColor: "white" }}>
//                 <Row>
//                     <Col lg={12} md={12} sm={12} className='shadow pt-2' style={{ backgroundColor: "white" }}>
//                         <h3 className='text-center mt-2'>Login</h3>
//                         <Form onSubmit={handleSubmit}>
//                             <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
//                                 <Form.Label className='text-black fw-bold'>Username</Form.Label>
//                                 <Form.Control
//                                     type="text"
//                                     placeholder="Enter Username"
//                                     size='lg'
//                                     value={username}
//                                     onChange={(e) => setUsername(e.target.value)}
//                                 />
//                             </Form.Group>
//                             <Form.Group className="mb-3" controlId="exampleForm.ControlInput2">
//                                 <Form.Label className='text-black fw-bold'>Password</Form.Label>
//                                 <Form.Control
//                                     type="password"
//                                     placeholder="Enter Password"
//                                     size='lg'
//                                     value={password}
//                                     onChange={(e) => setPassword(e.target.value)}
//                                 />
//                             </Form.Group>
//                             <Button variant="primary" type="submit" className='w-100 mb-4'>
//                                 Login
//                             </Button>
//                         </Form>
//                         {message && <p className="text-center text-danger">{message}</p>}
//                     </Col>
//                 </Row>
//             </Container>

//         </div>
//     );
// };

// export default Login;
import React, { useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from "axios";

const Login = ({ handleLogin }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!username || !password) {
            setMessage('All fields are required.');
            return;
        }

        try {
            const response = await axios.post(
                'http://localhost:8080/login',
                { username, password },
                { withCredentials: true, headers: { 'Content-Type': 'application/json' } }
            );

            setMessage(response.data.msg);
            const { userId, role } = response.data;

            if (userId) {
                localStorage.setItem('userId', userId);
                localStorage.setItem('role', role);

                if (handleLogin) {
                    handleLogin(userId);
                }

                // Redirect based on role
                navigate(role === "admin" ? "/admin" : "/home");
            } else {
                setMessage("User ID not found in response.");
            }
        } catch (error) {
            console.error('Login error:', error.response?.data || error.message);
            setMessage(error.response?.data?.msg || "Login failed.");
        }
    };

    return (
        <Container className="d-flex justify-content-center align-items-center vh-100">
            <Row>
                <Col lg={12} md={12} sm={12} className='shadow pt-2'>
                    <h3 className='text-center mt-2'>Login</h3>
                    {message && <div className="alert alert-danger text-center">{message}</div>}

                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label className='fw-bold'>Username</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label className='fw-bold'>Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Enter Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </Form.Group>

                        <Button variant="primary" type="submit" className='w-100 mb-4'>
                            Login
                        </Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
};

export default Login;
