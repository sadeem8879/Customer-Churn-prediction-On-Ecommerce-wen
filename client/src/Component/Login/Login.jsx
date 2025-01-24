// import { Container, Row, Col } from 'react-bootstrap'
// import React, { useState } from 'react'
// import Form from 'react-bootstrap/Form';
// import { Link, useNavigate } from 'react-router-dom';
// import axios from "axios"
// const Login = () => {
//   const [name, setName] = useState("")
//   const [email, setEmail] = useState("")
//   const [password, setPassword] = useState("")
//   const [message, setMessage] = useState("")
//   const navigate = useNavigate()
//   const handleSubmit = async (e) => {
//     e.preventDefault(); // Prevent default form submission
//     if (!name || !password) {
//       setMessage('All fields are required.');
//       if (username && password) {
//         const userId = username; // Assuming username as userId for simplicity
//         handleLogin(userId); // Pass userId to App component
//         navigate('/home'); // Redirect to home page
//       }
//       return;
//     }

//     try {
//       // Send POST request to backend for login
//       const response = await axios.post(
//         'http://localhost:8080/login',
//         {
//           username: name,
//           password,
//         },
//         {
//           withCredentials: true, // Important: Include cookies with the request
//           headers: {
//             'Content-Type': 'application/json',
//           },
//         }
//       );

//       // Handle response
//       setMessage(response.data.msg);
//       // localStorage.setItem('token', response.data.token);
//       // window.location.href = "/profile";
//       // if (response.data.token) {
//       //   localStorage.setItem("token", response.data.token);
//       //   navigate("/profile"); // Redirect to profile page after login
//       // }
//       navigate("/home");
      
//     } catch (error) {
//       console.error('Error:', error.response?.data || error.message); // Log detailed error
//       setMessage(error.response?.data?.msg || "Login failed");
//     }
    
//   }

//   return (
//     <div>
//       <Container className="d-flex justify-content-center align-items-center vh-100 " style={{ backgroundColor: "white" }}>
//         <Row>
//           <Col lg={12} md={12} sm={12} style={{ backgroundColor: "white" }} className='shadow pt-2'>
//             <h3 className='text-center mt-2'>Login</h3>
//             <Form onSubmit={handleSubmit}>
//               <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
//                 <Form.Label className='text- fw-bold '>Username</Form.Label>
//                 <Form.Control type="text" placeholder="Enter Username" size='lg'
//                   onChange={(e) => setName(e.target.value)}
//                 />              </Form.Group>
//               <Form.Group className="mb-3" controlId="exampleForm.ControlInput2">
//                 <Form.Label className='text-black fw-bold '>Password</Form.Label>
//                 <Form.Control type="password" placeholder="Enter Password" size='lg'
//                   onChange={(e) => setPassword(e.target.value)}
//                 />              </Form.Group>
//               <input type="submit" value="Login" className='w-100 mb-4' />

//             </Form>


//           </Col>
//         </Row>
//       </Container>

//     </div>
//   )
// }

// export default Login
import { Container, Row, Col } from 'react-bootstrap'
import React, { useState } from 'react'
import Form from 'react-bootstrap/Form';
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios"

const Login = ({ handleLogin }) => {
  const [name, setName] = useState("")
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState("")
  const navigate = useNavigate()

  // const handleSubmit = async (e) => {
  //   e.preventDefault(); // Prevent default form submission

  //   // Validate input
  //   if (!name || !password) {
  //     setMessage('All fields are required.');
  //     return;
  //   }

  //   try {
  //     // Send POST request to backend for login
  //     const response = await axios.post(
  //       'http://localhost:8080/login',
  //       {
  //         username: name,
  //         password,
  //       },
  //       {
  //         withCredentials: true, // Important: Include cookies with the request
  //         headers: {
  //           'Content-Type': 'application/json',
  //         },
  //       }
  //     );

  //     // Handle response
  //     setMessage(response.data.msg);

  //     // Assuming backend sends userId or token for successful login
  //     const userId = response.data.userId || name; // Adjust this based on your backend response
  //     localStorage.setItem('userId', userId); // Store userId in localStorage

  //     handleLogin(userId); // Pass userId to App component
  //     navigate('/home'); // Redirect to home page after successful login
  //   } catch (error) {
  //     console.error('Error:', error.response?.data || error.message); // Log detailed error
  //     setMessage(error.response?.data?.msg || "Login failed");
  //   }
  // }
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!name || !password) {
      setMessage('All fields are required.');
      return;
    }
  
    try {
      const response = await axios.post(
        'http://localhost:8080/login',
        {
          username: name,
          password,
        },
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
  
      setMessage(response.data.msg);
  
      // Ensure userId is in response and store it
      const userId = response.data.userId;
      if (userId) {
        localStorage.setItem('userId', userId); // Store userId only
        handleLogin(userId); // Pass userId to parent component
        navigate('/home'); // Redirect to home page
      } else {
        setMessage("User ID not found in response");
      }
    } catch (error) {
      console.error('Error:', error.response?.data || error.message);
      setMessage(error.response?.data?.msg || "Login failed");
    }
  };
  
  
  

  return (
    <div>
      <Container className="d-flex justify-content-center align-items-center vh-100 " style={{ backgroundColor: "white" }}>
        <Row>
          <Col lg={12} md={12} sm={12} style={{ backgroundColor: "white" }} className='shadow pt-2'>
            <h3 className='text-center mt-2'>Login</h3>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                <Form.Label className='text- fw-bold '>Username</Form.Label>
                <Form.Control type="text" placeholder="Enter Username" size='lg'
                  onChange={(e) => setName(e.target.value)}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="exampleForm.ControlInput2">
                <Form.Label className='text-black fw-bold '>Password</Form.Label>
                <Form.Control type="password" placeholder="Enter Password" size='lg'
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Form.Group>
              <input type="submit" value="Login" className='w-100 mb-4' />
            </Form>
            {message && <p className="text-center text-danger">{message}</p>}
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default Login
