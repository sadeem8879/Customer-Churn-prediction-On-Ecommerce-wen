// import React from 'react';
// import MyNavbar from '../../Component/Navbar/myNavbar';
// import { Container, Row, Col } from 'react-bootstrap';
// import './Home.css'; // Keep your CSS file
// import { useNavigate } from 'react-router-dom';

// const Home = () => {
//   const navigate=useNavigate()
//   const navigates=(route)=>{
//     navigate(route)
//   }

//   return (
//     <>
{/* <MyNavbar /> */ }
<Container fluid> {/* Use fluid container for full width */}
  <Row>
    <Col lg={6} className="main-image-col"> {/* Added a class */}
      <div className="main-image me-1">

        <h1 className='font bg_1_text '>Women's fashion</h1>
        <p className='bg_1_text2  '>Sitamet, consectetur adipiscing elit, sed do eiusmod tempor incidid-unt labore edolore magna aliquapendisse ultrices gravida.
        </p>
        <a href="" onClick={() => navigate('/womens')} className=' text-underline text-decoration-none ' style={{ paddingLeft: "80px" }}>SHOP NOW</a>
        <hr className='line' />
      </div> {/* Empty div for background image */}
    </Col>
    <Col lg={6} className="side-images-col"> {/* Added a class */}
      <Row>
        <Col xs={6} className="side-image ms-4">
          <div>
            <h1 className='font bg_2_text ps-3 mt-5 pt-5'>Men's fashion</h1>
            <p className='bg_2_text2 ps-3'>40 items</p>
            <a href="" onClick={() => navigate('/mens')} className=' text-underline text-decoration-none  ps-3 '>SHOP NOW</a>
            <hr className='line2' />
          </div>
        </Col>
        <Col xs={6} className="side-image " >
          <div>
            <h1 className='font bg_2_text ps-3 mt-5 pt-5'>Kid's fashion</h1>
            <p className='bg_2_text2 ps-3'>40 items</p>
            <a href="" onClick={() => navigate('/kids')} className=' text-underline  ps-3 text-decoration-none '>SHOP NOW</a>
            <hr className='line2' />
          </div>
        </Col>
      </Row>
      <Row>
        <Col xs={6} className="side-image-1 ms-4 mt-2">
          <div>
            <h1 className='font bg_2_text ps-3  mt-5 pt-5'>Cosmetics</h1>
            <p className='bg_2_text2 ps-3'>40 items</p>
            <a href="" onClick={() => navigate('/cosmetics')} className=' text-underline  ps-3  text-decoration-none'>SHOP NOW</a>
            <hr className='line2' />
          </div>
        </Col>
        <Col xs={6} className="side-image-1 mt-2">
          <div>
            <h1 className='font bg_2_text ps-3 mt-5 pt-5'>Accessories</h1>
            <p className='bg_2_text2 ps-3'>40 items</p>
            <a href="" onClick={() => navigate('/accessories')} className=' text-underline  ps-3  text-decoration-none'>SHOP NOW</a>
            <hr className='line2' />
          </div></Col>
      </Row>
    </Col>
  </Row>
</Container>
//     </>
//   );
// };

// export default Home;




// import React, { useState } from 'react';
// import { Container, Row, Col, Form, Button } from 'react-bootstrap';
// import { useNavigate } from 'react-router-dom';
// // import Footer from '../../Component/Footer/Footer';
// import './Home.css';
// import { Alert } from 'react-bootstrap';
// import axios from 'axios';

// const Home = () => {
//   // const navigate = useNavigate();
//   const [validated, setValidated] = useState(false);
//   const [inputValue, setInputValue] = useState("");
//   const [isVerified, setIsVerified] = useState(false);
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     mobile: "",
//     message: "",
//   });

//   const [success, setSuccess] = useState(null);
//   const [error, setError] = useState(null);

//   // Handle input changes
//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   // Handle form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setSuccess(null);
//     setError(null);
  
//     try {
//       const response = await axios.post("http://localhost:8080/contact", formData);
//       if (response.data.success) {
//         setSuccess("Your message has been sent successfully!");
//         setFormData({ name: "", email: "", mobile: "", message: "" }); // Clear form
//       }
//     } catch (error) {
//       setError("Something went wrong. Please try again later.");
//     }
//   };

//   return (
//     <>
//       {/* Hero Section */}

//       <Container fluid> {/* Use fluid container for full width */}
//         <Row>
//           <Col lg={6} className="main-image-col"> {/* Added a class */}
//             <div className="main-image me-1">

//               <h1 className='font bg_1_text '>Women's fashion</h1>
//               <p className='bg_1_text2  '>Sitamet, consectetur adipiscing elit, sed do eiusmod tempor incidid-unt labore edolore magna aliquapendisse ultrices gravida.
//               </p>
//               <a href="" onClick={() => navigate('/womens')} className=' text-underline text-decoration-none ' style={{ paddingLeft: "80px" }}>SHOP NOW</a>
//               <hr className='line' />
//             </div> {/* Empty div for background image */}
//           </Col>
//           <Col lg={6} className="side-images-col"> {/* Added a class */}
//             <Row>
//               <Col xs={6} className="side-image ms-4">
//                 <div>
//                   <h1 className='font bg_2_text ps-3 mt-5 pt-5'>Men's fashion</h1>
//                   <p className='bg_2_text2 ps-3'>40 items</p>
//                   <a href="" onClick={() => navigate('/mens')} className=' text-underline text-decoration-none  ps-3 '>SHOP NOW</a>
//                   <hr className='line2' />
//                 </div>
//               </Col>
//               <Col xs={6} className="side-image " >
//                 <div>
//                   <h1 className='font bg_2_text ps-3 mt-5 pt-5'>Kid's fashion</h1>
//                   <p className='bg_2_text2 ps-3'>40 items</p>
//                   <a href="" onClick={() => navigate('/kids')} className=' text-underline  ps-3 text-decoration-none '>SHOP NOW</a>
//                   <hr className='line2' />
//                 </div>
//               </Col>
//             </Row>
//             <Row>
//               <Col xs={6} className="side-image-1 ms-4 mt-2">
//                 <div>
//                   <h1 className='font bg_2_text ps-3  mt-5 pt-5'>Cosmetics</h1>
//                   <p className='bg_2_text2 ps-3'>40 items</p>
//                   <a href="" onClick={() => navigate('/cosmetics')} className=' text-underline  ps-3  text-decoration-none'>SHOP NOW</a>
//                   <hr className='line2' />
//                 </div>
//               </Col>
//               <Col xs={6} className="side-image-1 mt-2">
//                 <div>
//                   <h1 className='font bg_2_text ps-3 mt-5 pt-5'>Accessories</h1>
//                   <p className='bg_2_text2 ps-3'>40 items</p>
//                   <a href="" onClick={() => navigate('/accessories')} className=' text-underline  ps-3  text-decoration-none'>SHOP NOW</a>
//                   <hr className='line2' />
//                 </div></Col>
//             </Row>
//           </Col>
//         </Row>
//       </Container>

//       {/* About Us Section */}
//       <Container className="about-section text-center">
//         <h2>About Us</h2>
//         <Row>
//           <Col md={6}>
//             <h5>Few Words About US</h5>
//             <p>We are a fashion-forward e-commerce brand committed to bringing you the latest trends in clothing, accessories, and cosmetics.</p>
//           </Col>
//           <Col md={6}>
//             <img src="https://source.unsplash.com/500x300/?fashion,store" alt="About Us" className="about-image" />
//           </Col>
//         </Row>
//       </Container>

//       {/* Services Section */}
//       <Container className="services-section text-center mt-4">
//         <h2>Our Services</h2>
//         <Row>
//           <Col md={4} className="service-card">
//             <i className="fa-solid fa-truck-fast"></i>
//             <h4>Fast Delivery</h4>
//             <p>Quick and reliable shipping across the country.</p>
//           </Col>
//           <Col md={4} className="service-card">
//             <i className="fa-solid fa-tag"></i>
//             <h4>Exclusive Discounts</h4>
//             <p>Enjoy great offers on all our products.</p>
//           </Col>
//           <Col md={4} className="service-card">
//             <i className="fa-solid fa-headset"></i>
//             <h4>24/7 Support</h4>
//             <p>Our team is always ready to help you.</p>
//           </Col>
//         </Row>
//       </Container>

//       {/* Contact Us Section */}
//       <Container className="contact-section">
//         <h2>Get in Touch</h2>
//         <Row>
//           <Col md={6}>
//             <Form onSubmit={handleSubmit} className="contact-form">
//               {success && <Alert variant="success">{success}</Alert>}
//               {error && <Alert variant="danger">{error}</Alert>}

//               <Form.Group className="mb-3">
//                 <Form.Control type="text" name="name" placeholder="Your Name" value={formData.name} onChange={handleChange} required />
//               </Form.Group>

//               <Form.Group className="mb-3">
//                 <Form.Control type="email" name="email" placeholder="Enter Email Address" value={formData.email} onChange={handleChange} required />
//               </Form.Group>

//               <Form.Group className="mb-3">
//                 <Form.Control type="text" name="mobile" placeholder="Enter Mobile Number" value={formData.mobile} onChange={handleChange} required />
//               </Form.Group>

//               <Form.Group className="mb-3">
//                 <Form.Control as="textarea" rows={4} name="message" placeholder="Your Message" value={formData.message} onChange={handleChange} required />
//               </Form.Group>

//               <Button type="submit" className="submit-btn">Submit</Button>
//             </Form>
//           </Col>
//           <Col md={6} className="address-section">
//             <h2>Our Address</h2>
//             <p><i className="bi bi-building-fill-add font-awesome"></i> 2130 Fulton Street, San Diego, CA</p>
//             <p><i className="bi bi-telephone-fill font-awesome"></i> 1-800-1234-567</p>
//             <p><i className="bi bi-envelope-fill font-awesome"></i> info@demolink.org</p>
//             <iframe src="https://www.google.com/maps/embed?pb=..." width="100%" height="300" style={{ border: 0 }}></iframe>
//           </Col>
//         </Row>
//       </Container>



//       {/* Footer */}
//       {/* <Footer /> */}
//     </>
//   );
// };

// export default Home;




import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    message: "",
  });
  const userId = parseInt(localStorage.getItem('userId'), 10);

        if (!userId) {
            navigate('/login');
            return;
        }

  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(null);
    setError(null);

    try {
      const response = await axios.post("http://localhost:8080/contact", formData);
      if (response.data.success) {
        setSuccess("Your message has been sent successfully!");
        setFormData({ name: "", email: "", mobile: "", message: "" }); // Clear form
      }
    } catch (error) {
      setError("Something went wrong. Please try again later.");
    }
  };

  return (
    <>
      {/* Hero Section */}
      <Container fluid>
        <Row>
          <Col lg={6} className="main-image-col">
            <div className="main-image me-1">
              <h1 className='font bg_1_text '>Women's Fashion</h1>
              <p className='bg_1_text2'>Discover the latest trends in women's fashion.</p>
              <a href="#" onClick={() => navigate('/womens')} className='text-decoration-none' style={{ paddingLeft: "80px" }}>SHOP NOW</a>
              <hr className='line' />
            </div>
          </Col>
          <Col lg={6} className="side-images-col">
            <Row>
              <Col xs={6} className="side-image ms-4">
                <div>
                  <h1 className='font bg_2_text ps-3 mt-5 pt-5'>Men's Fashion</h1>
                  <p className='bg_2_text2 ps-3'>40 items</p>
                  <a href="#" onClick={() => navigate('/mens')} className='text-decoration-none ps-3'>SHOP NOW</a>
                  <hr className='line2' />
                </div>
              </Col>
              <Col xs={6} className="side-image">
                <div>
                  <h1 className='font bg_2_text ps-3 mt-5 pt-5'>Kid's Fashion</h1>
                  <p className='bg_2_text2 ps-3'>40 items</p>
                  <a href="#" onClick={() => navigate('/kids')} className='text-decoration-none ps-3'>SHOP NOW</a>
                  <hr className='line2' />
                </div>
              </Col>
            </Row>
            <Row>
              <Col xs={6} className="side-image-1 ms-4 mt-2">
                <div>
                  <h1 className='font bg_2_text ps-3 mt-5 pt-5'>Cosmetics</h1>
                  <p className='bg_2_text2 ps-3'>40 items</p>
                  <a href="#" onClick={() => navigate('/cosmetics')} className='text-decoration-none ps-3'>SHOP NOW</a>
                  <hr className='line2' />
                </div>
              </Col>
              <Col xs={6} className="side-image-1 mt-2">
                <div>
                  <h1 className='font bg_2_text ps-3 mt-5 pt-5'>Accessories</h1>
                  <p className='bg_2_text2 ps-3'>40 items</p>
                  <a href="#" onClick={() => navigate('/accessories')} className='text-decoration-none ps-3'>SHOP NOW</a>
                  <hr className='line2' />
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>

      {/* About Us Section */}
      <Container className="about-section text-center">
        <h2>About Us</h2>
        <Row>
          <Col md={6}>
            <h5>Who We Are</h5>
            <p>We bring you the latest trends in clothing, accessories, and cosmetics.</p>
          </Col>
          <Col md={6}>
            <img src="https://source.unsplash.com/500x300/?fashion,store" alt="About Us" className="about-image" />
          </Col>
        </Row>
      </Container>

      {/* Services Section */}
      <Container className="services-section text-center mt-4">
        <h2>Our Services</h2>
        <Row>
          <Col md={4} className="service-card">
            <i className="fa-solid fa-truck-fast"></i>
            <h4>Fast Delivery</h4>
            <p>Quick and reliable shipping.</p>
          </Col>
          <Col md={4} className="service-card">
            <i className="fa-solid fa-tag"></i>
            <h4>Exclusive Discounts</h4>
            <p>Enjoy great offers on all products.</p>
          </Col>
          <Col md={4} className="service-card">
            <i className="fa-solid fa-headset"></i>
            <h4>24/7 Support</h4>
            <p>Our team is always ready to assist.</p>
          </Col>
        </Row>
      </Container>

      {/* Contact Us Section */}
      <Container className="contact-section">
        <h2>Contact Us</h2>
        <Row>
          <Col md={6}>
            <Form onSubmit={handleSubmit} className="contact-form">
              {success && <Alert variant="success">{success}</Alert>}
              {error && <Alert variant="danger">{error}</Alert>}

              <Form.Group className="mb-3">
                <Form.Control type="text" name="name" placeholder="Your Name" value={formData.name} onChange={handleChange} required />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Control type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} required />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Control type="text" name="mobile" placeholder="Mobile Number" value={formData.mobile} onChange={handleChange} required />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Control as="textarea" rows={4} name="message" placeholder="Your Message" value={formData.message} onChange={handleChange} required />
              </Form.Group>

              <Button type="submit" className="submit-btn">Submit</Button>
            </Form>
          </Col>
          <Col md={6} className="address-section">
            <h2>Our Address</h2>
            <p><i className="bi bi-building-fill"></i> 2130 Fulton Street, San Diego, CA</p>
            <p><i className="bi bi-telephone-fill"></i> 1-800-1234-567</p>
            <p><i className="bi bi-envelope-fill"></i> info@demolink.org</p>
            <iframe src="https://www.google.com/maps/embed?pb=..." width="100%" height="300" style={{ border: 0 }} title="map"></iframe>
          </Col>
        </Row>
      </Container>

      {/* Footer (Uncomment if needed) */}
      {/* <Footer /> */}
    </>
  );
};

export default Home;
