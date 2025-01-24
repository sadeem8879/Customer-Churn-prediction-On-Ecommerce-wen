// import React, { useState } from 'react'
// import { Container, Row, Col } from 'react-bootstrap'
// import Button from 'react-bootstrap/Button';
// import Form from 'react-bootstrap/Form';
// import { Link,useNavigate } from 'react-router-dom';
// import axios from "axios"
// const Register = () => {
//     const [name, setName] = useState("")
//     const [email, setEmail] = useState("")
//     const [password, setPassword] = useState("")
//     const [message,setMessage]=useState("")
//     const navigate=useNavigate()
//     const handleSubmit = async (e) => {
//         e.preventDefault(); // Prevent default form submission
//         if (!name || !email || !password) {
//             setMessage('All fields are required.');
//             return;
//           }

//         try {
//             const response = await axios.post("http://localhost:8080/register/", {
//                 Username: name,
//                 email,
//                 password,
//                 withCredentials: true,
//             });
//             setMessage(response.data.msg);
//             localStorage.setItem('token', response.data.token);
//             console.log(response)
//             if (response.data.token) {
//                 localStorage.setItem("token", response.data.token);
//                 navigate("/profile"); // Redirect to profile page after login
//               }

//         } catch (error) {
//             setMessage(error.response?.data?.msg || "Registration failed"); // Show error message
//         }
//     }

//     return (
//         <>

//             <Container className="d-flex justify-content-center align-items-center vh-100 " style={{ backgroundColor: "white" }}>
//                 <Row>
//                     <Col lg={12} md={12} sm={12} style={{ backgroundColor: "white" }} className='shadow pt-2'>
//                         <h3 className='text-center mt-2'>Register</h3>
//                         <Form onSubmit={handleSubmit}>
//                             <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
//                                 <Form.Label className='text- fw-bold '>Username</Form.Label>
//                                 <Form.Control type="text" placeholder="Enter Username" size='lg'
//                                     onChange={(e) => setName(e.target.value)}
//                                 />
//                             </Form.Group>
//                             <Form.Group className="mb-3" controlId="exampleForm.ControlInput3">
//                                 <Form.Label className='text- fw-bold '>Email address</Form.Label>
//                                 <Form.Control type="email" placeholder="Enter Email Address" size='lg'
//                                     onChange={(e) => setEmail(e.target.value)}
//                                 />
//                             </Form.Group>
//                             <Form.Group className="mb-3" controlId="exampleForm.ControlInput2">
//                                 <Form.Label className='text-black fw-bold '>Password</Form.Label>
//                                 <Form.Control type="password" placeholder="Enter Password" size='lg'
//                                     onChange={(e) => setPassword(e.target.value)}
//                                 />
//                             </Form.Group>
//                             <input type="submit" value="Submit" className='w-100 btn btn-primary' />

//                         </Form>
//                         <div className='d-flex gap-2 mt-2'>
//                             <p>Already have an account?</p>
//                             <Link to="/login">Login</Link>
//                         </div>

//                     </Col>
//                 </Row>
//             </Container>
//         </>
//     )
// }

// export default Register
import React, { useState } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios"

const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission

        if (!name || !email || !password) {
            setMessage('All fields are required.');
            return;
        }

        try {
            const response = await axios.post("http://localhost:8080/", {
                username: name,
                email,
                password,
                withCredentials: true, // Send cookies with request if needed
            },
                {
                    headers: { "Content-Type": "application/json" },
                }
            );

            setMessage(response.data.msg); // Display response message
            // if (response.data.token) {
            //     localStorage.setItem("token", response.data.token);
            //     navigate("/profile"); // Redirect to profile page after successful registration
            // }
            navigate("/home")
        } catch (error) {
            console.error('Error details:', error); // Log error to the console for debugging
            setMessage(error.response?.data?.msg || "Registration failed, please try again.");
        }
    }

    return (
        <>
            <Container className="d-flex justify-content-center align-items-center vh-100" style={{ backgroundColor: "white" }}>
                <Row>
                    <Col lg={12} md={12} sm={12} className="shadow pt-2">
                        <h3 className="text-center mt-2">Register</h3>
                        {message && <div className="alert alert-info">{message}</div>} {/* Show success or error messages */}

                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-3" controlId="formUsername">
                                <Form.Label className="fw-bold">Username</Form.Label>
                                <Form.Control type="text" placeholder="Enter Username" size="lg"
                                    onChange={(e) => setName(e.target.value)}
                                    value={name} />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formEmail">
                                <Form.Label className="fw-bold">Email address</Form.Label>
                                <Form.Control type="email" placeholder="Enter Email Address" size="lg"
                                    onChange={(e) => setEmail(e.target.value)}
                                    value={email} />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formPassword">
                                <Form.Label className="fw-bold">Password</Form.Label>
                                <Form.Control type="password" placeholder="Enter Password" size="lg"
                                    onChange={(e) => setPassword(e.target.value)}
                                    value={password} />
                            </Form.Group>

                            <Button type="submit" variant="primary" className="w-100">
                                Submit
                            </Button>
                        </Form>

                        <div className="d-flex gap-2 mt-2">
                            <p>Already have an account?</p>
                            <Link to="/login">Login</Link>
                        </div>
                    </Col>
                </Row>
            </Container>
        </>
    )
}

export default Register;
