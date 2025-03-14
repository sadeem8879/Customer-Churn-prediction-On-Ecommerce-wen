// import React, { useState } from 'react'
// import { Container, Row, Col } from 'react-bootstrap'
// import Button from 'react-bootstrap/Button';
// import Form from 'react-bootstrap/Form';
// import { Link, useNavigate } from 'react-router-dom';
// import axios from "axios"

// const Register = () => {
//     const [name, setName] = useState("");
//     const [email, setEmail] = useState("");
//     const [password, setPassword] = useState("");
//     const [message, setMessage] = useState("");
//     const navigate = useNavigate();

//     const handleSubmit = async (e) => {
//         e.preventDefault(); // Prevent default form submission

//         if (!name || !email || !password) {
//             setMessage('All fields are required.');
//             return;
//         }

//         try {
//             const response = await axios.post("http://localhost:8080/", {
//                 username: name,
//                 email,
//                 password,
//                 withCredentials: true, // Send cookies with request if needed
//             },
//                 {
//                     headers: { "Content-Type": "application/json" },
//                 }
//             );

//             setMessage(response.data.msg); // Display response message
//             // if (response.data.token) {
//             //     localStorage.setItem("token", response.data.token);
//             //     navigate("/profile"); // Redirect to profile page after successful registration
//             // }
//             navigate("/home")
//         } catch (error) {
//             console.error('Error details:', error); // Log error to the console for debugging
//             setMessage(error.response?.data?.msg || "Registration failed, please try again.");
//         }
//     }

//     return (
//         <>
//             <Container className="d-flex justify-content-center align-items-center vh-100" style={{ backgroundColor: "white" }}>
//                 <Row>
//                     <Col lg={12} md={12} sm={12} className="shadow pt-2">
//                         <h3 className="text-center mt-2">Register</h3>
//                         {message && <div className="alert alert-info">{message}</div>} {/* Show success or error messages */}

//                         <Form onSubmit={handleSubmit}>
//                             <Form.Group className="mb-3" controlId="formUsername">
//                                 <Form.Label className="fw-bold">Username</Form.Label>
//                                 <Form.Control type="text" placeholder="Enter Username" size="lg"
//                                     onChange={(e) => setName(e.target.value)}
//                                     value={name} />
//                             </Form.Group>

//                             <Form.Group className="mb-3" controlId="formEmail">
//                                 <Form.Label className="fw-bold">Email address</Form.Label>
//                                 <Form.Control type="email" placeholder="Enter Email Address" size="lg"
//                                     onChange={(e) => setEmail(e.target.value)}
//                                     value={email} />
//                             </Form.Group>

//                             <Form.Group className="mb-3" controlId="formPassword">
//                                 <Form.Label className="fw-bold">Password</Form.Label>
//                                 <Form.Control type="password" placeholder="Enter Password" size="lg"
//                                     onChange={(e) => setPassword(e.target.value)}
//                                     value={password} />
//                             </Form.Group>
//                             <Form.Group className="mb-3">
//                           <Form.Label>Role</Form.Label>
//                           <Form.Select name="role" value={formData.role} onChange={handleChange}>
//                               <option value="user">User</option>
//                                <option value="admin">Admin</option>
//                           </Form.Select>
//                       </Form.Group>
//                         {formData.role === "admin" && (
//                             <Form.Group className="mb-3">
//                                 <Form.Label>Admin Secret Key</Form.Label>
//                                 <Form.Control type="password" name="secretKey" value={formData.secretKey} onChange={handleChange} />
//                             </Form.Group>
//                         )}

//                             <Button type="submit" variant="primary" className="w-100">
//                                 Submit
//                             </Button>
//                         </Form>

//                         <div className="d-flex gap-2 mt-2">
//                             <p>Already have an account?</p>
//                             <Link to="/login">Login</Link>
//                         </div>
//                     </Col>
//                 </Row>
//             </Container>
//         </>
//     )
// }

// export default Register;import React, { useState } from "react";import { Container, Row, Col, Form, Button } from "react-bootstrap";
// import React, { useState, useEffect } from 'react';
// import { Container, Row, Col } from 'react-bootstrap';
// import Button from 'react-bootstrap/Button';
// import Form from 'react-bootstrap/Form';
// import { Link, useNavigate } from 'react-router-dom';
// import axios from 'axios';

// const Register = () => {
//     const [formData, setFormData] = useState({
//         username: '',
//         email: '',
//         password: '',
//         role: 'user',
//         secretKey: '',
//     });

//     const [message, setMessage] = useState('');
//     const navigate = useNavigate();

//     // Fetch the secret key from environment variables
//     const frontendSecretKey = import.meta.env.VITE_SECRET_KEY;
//     const adminUsername = import.meta.env.VITE_ADMIN_USERNAME;
//     const adminPassword = import.meta.env.VITE_ADMIN_PASS;

//     useEffect(() => {
//         console.log('Frontend Secret Key:', frontendSecretKey); // Debugging
//     }, []);

//     const handleChange = (e) => {
//         setFormData({ ...formData, [e.target.name]: e.target.value });
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         console.log('Form Data:', formData); // Debugging

//         if (!formData.username || !formData.email || !formData.password) {
//             setMessage('All fields are required.');
//             return;
//         }

//         if (formData.role === 'admin') {
//             if (!formData.secretKey) {
//                 setMessage('Secret Key is required for admin registration.');
//                 return;
//             }
//             if (formData.secretKey !== frontendSecretKey) {
//                 setMessage('Invalid Secret Key.');
//                 return;
//             }
//         }

//         try {
//             const response = await axios.post('http://localhost:8080/', formData, {
//                 headers: { 'Content-Type': 'application/json' },
//                 withCredentials: true,
//             });

//             console.log('Backend Response:', response.data); // Debugging

//             setMessage(response.data.msg);

//             if (response.data.success) {
//                 // Store userId and role in localStorage
//                 const userId = response.data.userId; // Add this line

//                 localStorage.setItem('userId', userId); // Use the extracted userId
//                 localStorage.setItem('role', formData.role);

//                 if (formData.role === 'admin') {
//                     localStorage.setItem('userId', userId);

//                     navigate('/admin-login'); // Redirect to admin login
//                 } else {
//                     navigate('/home'); // Redirect normal users to home
//                 }
//             }
//         } catch (error) {
//             console.error('Error:', error);
//             setMessage(error.response?.data?.msg || 'Registration failed, please try again.');
//         }
//     };

//     return (
//         <Container className="d-flex justify-content-center align-items-center vh-100">
//             <Row>
//                 <Col lg={12} md={12} sm={12} className="shadow pt-2">
//                     <h3 className="text-center mt-2">Register</h3>
//                     {message && <div className="alert alert-info">{message}</div>}

//                     <Form onSubmit={handleSubmit}>
//                         <Form.Group className="mb-3">
//                             <Form.Label className="fw-bold">Username</Form.Label>
//                             <Form.Control
//                                 type="text"
//                                 placeholder="Enter Username"
//                                 name="username"
//                                 value={formData.username}
//                                 onChange={handleChange}
//                             />
//                         </Form.Group>

//                         <Form.Group className="mb-3">
//                             <Form.Label className="fw-bold">Email address</Form.Label>
//                             <Form.Control
//                                 type="email"
//                                 placeholder="Enter Email Address"
//                                 name="email"
//                                 value={formData.email}
//                                 onChange={handleChange}
//                             />
//                         </Form.Group>

//                         <Form.Group className="mb-3">
//                             <Form.Label className="fw-bold">Password</Form.Label>
//                             <Form.Control
//                                 type="password"
//                                 placeholder="Enter Password"
//                                 name="password"
//                                 value={formData.password}
//                                 onChange={handleChange}
//                             />
//                         </Form.Group>
//                         <Form.Group className="mb-3">
//                             <Form.Label className="fw-bold">Password</Form.Label>
//                             <Form.Control
//                                 type="number"
//                                 placeholder="Enter age"
//                                 name="password"
//                                 value={formData.password}
//                                 onChange={handleChange}
//                             />
//                         </Form.Group>
//                         // select box box whic include all india states n user can select 1 only at a time
//                         <Form.Group className="mb-3">
//                             <Form.Label className="fw-bold">Password</Form.Label>
//                             <Form.Control
//                                 type="password"
//                                 placeholder="Enter Password"
//                                 name="password"
//                                 value={formData.password}
//                                 onChange={handleChange}
//                             />
//                         </Form.Group>
//                         <Form.Group className="mb-3">
//                             <Form.Label>Role</Form.Label>
//                             <Form.Select name="role" value={formData.role} onChange={handleChange}>
//                                 <option value="user">User</option>
//                                 <option value="admin">Admin</option>
//                             </Form.Select>
//                         </Form.Group>

//                         {formData.role === 'admin' && (
//                             <Form.Group className="mb-3">
//                                 <Form.Label>Admin Secret Key</Form.Label>
//                                 <Form.Control
//                                     type="password"
//                                     name="secretKey"
//                                     placeholder="Enter Secret Key"
//                                     value={formData.secretKey || ''}
//                                     onChange={handleChange}
//                                 />
//                             </Form.Group>
//                         )}

//                         <Button type="submit" variant="primary" className="w-100">
//                             Register
//                         </Button>
//                     </Form>

//                     <div className="d-flex gap-2 mt-2">
//                         <p>Already have an account?</p>
//                         <Link to="/login">Login</Link>
//                     </div>
//                 </Col>
//             </Row>
//         </Container>
//     );
// };

// export default Register;
// import React, { useState, useEffect } from 'react';
// import { Container, Row, Col } from 'react-bootstrap';
// import Button from 'react-bootstrap/Button';
// import Form from 'react-bootstrap/Form';
// import { Link, useNavigate } from 'react-router-dom';
// import axios from 'axios';

// const Register = () => {
//     const [formData, setFormData] = useState({
//         username: '',
//         email: '',
//         password: '',
//         age: '',
//         state: '',
//         role: 'user',
//         secretKey: '',
//     });

//     const [message, setMessage] = useState('');
//     const navigate = useNavigate();

//     const frontendSecretKey = import.meta.env.VITE_SECRET_KEY;

//     useEffect(() => {
//         console.log('Frontend Secret Key:', frontendSecretKey);
//     }, []);

//     const handleChange = (e) => {
//         setFormData({ ...formData, [e.target.name]: e.target.value });
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         console.log('Form Data:', formData);

//         if (!formData.username || !formData.email || !formData.password) {
//             setMessage('All fields are required.');
//             return;
//         }

//         if (formData.role === 'admin') {
//             if (!formData.secretKey) {
//                 setMessage('Secret Key is required for admin registration.');
//                 return;
//             }
//             if (formData.secretKey !== frontendSecretKey) {
//                 setMessage('Invalid Secret Key.');
//                 return;
//             }
//         }

//         try {
//             const response = await axios.post('http://localhost:8080/', formData, {
//                 headers: { 'Content-Type': 'application/json' },
//                 withCredentials: true,
//             });

//             console.log('Backend Response:', response.data);

//             setMessage(response.data.msg);

//             if (response.data.success) {
//                 // Store userId and role in localStorage
//                 const userId = response.data.userId; // Add this line

//                 localStorage.setItem('userId', userId); // Use the extracted userId
//                 localStorage.setItem('role', formData.role);

//                 if (formData.role === 'admin') {
//                     localStorage.setItem('userId', userId);

//                     navigate('/admin-login'); // Redirect to admin login
//                 } else {
//                     navigate('/home'); // Redirect normal users to home
//                 }
//             }
//         } catch (error) {
//             console.error('Error:', error);
//             setMessage(error.response?.data?.msg || 'Registration failed, please try again.');
//         }
//     };

//     const indianStates = [
//         'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat',
//         'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh',
//         'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
//         'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh',
//         'Uttarakhand', 'West Bengal', 'Andaman and Nicobar Islands', 'Chandigarh',
//         'Dadra and Nagar Haveli and Daman and Diu', 'Delhi', 'Lakshadweep', 'Puducherry'
//     ];

//     return (
//         <Container className="d-flex justify-content-center align-items-center vh-100">
//             <Row>
//                 <Col lg={12} md={12} sm={12} className="shadow pt-2">
//                     <h3 className="text-center mt-2">Register</h3>
//                     {message && <div className="alert alert-info">{message}</div>}

//                     <Form onSubmit={handleSubmit}>
//                         <Form.Group className="mb-3">
//                             <Form.Label className="fw-bold">Username</Form.Label>
//                             <Form.Control type="text" placeholder="Enter Username" name="username" value={formData.username} onChange={handleChange} />
//                         </Form.Group>

//                         <Form.Group className="mb-3">
//                             <Form.Label className="fw-bold">Email address</Form.Label>
//                             <Form.Control type="email" placeholder="Enter Email Address" name="email" value={formData.email} onChange={handleChange} />
//                         </Form.Group>

//                         <Form.Group className="mb-3">
//                             <Form.Label className="fw-bold">Password</Form.Label>
//                             <Form.Control type="password" placeholder="Enter Password" name="password" value={formData.password} onChange={handleChange} />
//                         </Form.Group>

//                         <Form.Group className="mb-3">
//                             <Form.Label className="fw-bold">Age</Form.Label>
//                             <Form.Control type="number" placeholder="Enter age" name="age" value={formData.age} onChange={handleChange} />
//                         </Form.Group>

//                         <Form.Group className="mb-3">
//                             <Form.Label className="fw-bold">State</Form.Label>
//                             <Form.Select name="state" value={formData.state} onChange={handleChange}>
//                                 <option value="">Select State</option>
//                                 {indianStates.map((state) => (
//                                     <option key={state} value={state}>{state}</option>
//                                 ))}
//                             </Form.Select>
//                         </Form.Group>

//                         <Form.Group className="mb-3">
//                             <Form.Label>Role</Form.Label>
//                             <Form.Select name="role" value={formData.role} onChange={handleChange}>
//                                 <option value="user">User</option>
//                                 <option value="admin">Admin</option>
//                             </Form.Select>
//                         </Form.Group>

//                         {formData.role === 'admin' && (
//                             <Form.Group className="mb-3">
//                                 <Form.Label>Admin Secret Key</Form.Label>
//                                 <Form.Control type="password" name="secretKey" placeholder="Enter Secret Key" value={formData.secretKey || ''} onChange={handleChange} />
//                             </Form.Group>
//                         )}

//                         <Button type="submit" variant="primary" className="w-100">Register</Button>
//                     </Form>

//                     <div className="d-flex gap-2 mt-2">
//                         <p>Already have an account?</p>
//                         <Link to="/login">Login</Link>
//                     </div>
//                 </Col>
//             </Row>
//         </Container>
//     );
// };

// export default Register;
// import React, { useState, useEffect } from 'react';
// import { Container, Row, Col } from 'react-bootstrap';
// import Button from 'react-bootstrap/Button';
// import Form from 'react-bootstrap/Form';
// import { Link, useNavigate } from 'react-router-dom';
// import axios from 'axios';

// const Register = () => {
//     const [formData, setFormData] = useState({
//         username: '',
//         email: '',
//         password: '',
//         age: '',
//         state: '',
//         role:'user',
//         gender: '' // Added gender field
//     });

//     const [message, setMessage] = useState('');
//     const navigate = useNavigate();

//     const handleChange = (e) => {
//         setFormData({ ...formData, [e.target.name]: e.target.value });
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         console.log('Form Data:', formData);

//         if (!formData.username || !formData.email || !formData.password || !formData.gender || !formData.state || !formData.age) {
//             setMessage('All fields are required.');
//             return;
//         }

//         try {
//             const response = await axios.post('http://localhost:8080/', formData, {
//                 headers: { 'Content-Type': 'application/json' },
//                 withCredentials: true,
//             });

//             console.log('Backend Response:', response.data);

//             setMessage(response.data.msg);

//             if (response.data.success) {
//                 navigate('/home'); // Redirect normal users to home
//             }
//         } catch (error) {
//             console.error('Error:', error);
//             setMessage(error.response?.data?.msg || 'Registration failed, please try again.');
//         }
//     };
//     // const handleSubmit = async (e) => {
//     //     e.preventDefault();
    
//     //     console.log('Form Data:', formData);
    
//     //     if (!formData.username || !formData.email || !formData.password || !formData.gender || !formData.state || !formData.age) {
//     //         setMessage('All fields are required.');
//     //         return;
//     //     }
    
//     //     // Ensure 'role' has a value
//     //     const dataToSend = { ...formData, role: formData.role || 'user' };
    
//     //     try {
//     //         const response = await axios.post('http://localhost:8080/', dataToSend, {
//     //             headers: { 'Content-Type': 'application/json' },
//     //             withCredentials: true,
//     //         });
    
//     //         console.log('Backend Response:', response.data);
    
//     //         setMessage(response.data.msg);
    
//     //         if (response.data.success) {
//     //             navigate('/home');
//     //         }
//     //     } catch (error) {
//     //         console.error('Error:', error);
//     //         setMessage(error.response?.data?.msg || 'Registration failed, please try again.');
//     //     }
//     // };
    
//     const indianStates = [
//         'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat',
//         'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh',
//         'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
//         'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh',
//         'Uttarakhand', 'West Bengal', 'Andaman and Nicobar Islands', 'Chandigarh',
//         'Dadra and Nagar Haveli and Daman and Diu', 'Delhi', 'Lakshadweep', 'Puducherry'
//     ];

//     return (
//         <Container className="d-flex justify-content-center align-items-center vh-100">
//             <Row>
//                 <Col lg={12} md={12} sm={12} className="shadow pt-2">
//                     <h3 className="text-center mt-2">Register</h3>
//                     {message && <div className="alert alert-info">{message}</div>}

//                     <Form onSubmit={handleSubmit}>
//                         <Form.Group className="mb-3">
//                             <Form.Label className="fw-bold">Username</Form.Label>
//                             <Form.Control type="text" placeholder="Enter Username" name="username" value={formData.username} onChange={handleChange} />
//                         </Form.Group>

//                         <Form.Group className="mb-3">
//                             <Form.Label className="fw-bold">Email address</Form.Label>
//                             <Form.Control type="email" placeholder="Enter Email Address" name="email" value={formData.email} onChange={handleChange} />
//                         </Form.Group>

//                         <Form.Group className="mb-3">
//                             <Form.Label className="fw-bold">Password</Form.Label>
//                             <Form.Control type="password" placeholder="Enter Password" name="password" value={formData.password} onChange={handleChange} />
//                         </Form.Group>

//                         <Form.Group className="mb-3">
//                             <Form.Label className="fw-bold">Age</Form.Label>
//                             <Form.Control type="number" placeholder="Enter age" name="age" value={formData.age} onChange={handleChange} />
//                         </Form.Group>

//                         <Form.Group className="mb-3">
//                             <Form.Label className="fw-bold">State</Form.Label>
//                             <Form.Select name="state" value={formData.state} onChange={handleChange}>
//                                 <option value="">Select State</option>
//                                 {indianStates.map((state) => (
//                                     <option key={state} value={state}>{state}</option>
//                                 ))}
//                             </Form.Select>
//                         </Form.Group>

//                         <Form.Group className="mb-3">
//                             <Form.Label className="fw-bold">Gender</Form.Label>
//                             <div>
//                                 <Form.Check
//                                     inline
//                                     label="Male"
//                                     type="radio"
//                                     name="gender"
//                                     value="male"
//                                     checked={formData.gender === 'male'}
//                                     onChange={handleChange}
//                                 />
//                                 <Form.Check
//                                     inline
//                                     label="Female"
//                                     type="radio"
//                                     name="gender"
//                                     value="female"
//                                     checked={formData.gender === 'female'}
//                                     onChange={handleChange}
//                                 />
//                             </div>
//                         </Form.Group>

//                         <Button type="submit" variant="primary" className="w-100">Register</Button>
//                     </Form>

//                     <div className="d-flex gap-2 mt-2">
//                         <p>Already have an account?</p>
//                         <Link to="/login">Login</Link>
//                     </div>
//                 </Col>
//             </Row>
//         </Container>
//     );
// };

// export default Register;
import React, { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        age: '',
        state: '',
        role: 'user',
        gender: ''
    });

    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log('Form Data:', formData);

        if (!formData.username || !formData.email || !formData.password || !formData.gender || !formData.state || !formData.age) {
            setMessage('All fields are required.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:8080/', formData, {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true,
            });

            console.log('Backend Response:', response.data);
            setMessage(response.data.msg);

            if (response.data.success) {
                navigate('/home');
            }
        } catch (error) {
            console.error('Error:', error);
            setMessage(error.response?.data?.msg || 'Registration failed, please try again.');
        }
    };

    const indianStates = [
        'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat',
        'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh',
        'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
        'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh',
        'Uttarakhand', 'West Bengal', 'Andaman and Nicobar Islands', 'Chandigarh',
        'Dadra and Nagar Haveli and Daman and Diu', 'Delhi', 'Lakshadweep', 'Puducherry'
    ];

    return (
        <Container className="d-flex justify-content-center align-items-center vh-100">
            <Row>
                <Col lg={12} md={12} sm={12} className="shadow pt-2">
                    <h3 className="text-center mt-2">Register</h3>
                    {message && <div className="alert alert-info">{message}</div>}

                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label className="fw-bold">Username</Form.Label>
                            <Form.Control type="text" placeholder="Enter Username" name="username" value={formData.username} onChange={handleChange} />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label className="fw-bold">Email address</Form.Label>
                            <Form.Control type="email" placeholder="Enter Email Address" name="email" value={formData.email} onChange={handleChange} />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label className="fw-bold">Password</Form.Label>
                            <Form.Control type="password" placeholder="Enter Password" name="password" value={formData.password} onChange={handleChange} />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label className="fw-bold">Age</Form.Label>
                            <Form.Control type="number" placeholder="Enter age" name="age" value={formData.age} onChange={handleChange} />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label className="fw-bold">State</Form.Label>
                            <Form.Select name="state" value={formData.state} onChange={handleChange}>
                                <option value="">Select State</option>
                                {indianStates.map((state) => (
                                    <option key={state} value={state}>{state}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label className="fw-bold">Gender</Form.Label>
                            <div>
                                <Form.Check
                                    inline
                                    label="Male"
                                    type="radio"
                                    name="gender"
                                    value="male"
                                    checked={formData.gender === 'male'}
                                    onChange={handleChange}
                                />
                                <Form.Check
                                    inline
                                    label="Female"
                                    type="radio"
                                    name="gender"
                                    value="female"
                                    checked={formData.gender === 'female'}
                                    onChange={handleChange}
                                />
                            </div>
                        </Form.Group>

                        <Button type="submit" variant="primary" className="w-100">Register</Button>
                    </Form>

                    <div className="d-flex gap-2 mt-2">
                        <p>Already have an account?</p>
                        <Link to="/login">Login</Link>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default Register;
