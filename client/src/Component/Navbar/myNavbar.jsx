// import React from 'react'
// // import Button from 'react-bootstrap/Button';
// import Container from 'react-bootstrap/Container';
// // import Form from 'react-bootstrap/Form';
// import Nav from 'react-bootstrap/Nav';
// import Navbar from 'react-bootstrap/Navbar';
// // import NavDropdown from 'react-bootstrap/NavDropdown';
// // import logo from "../../assets/logo.jpeg"
// import { Link } from 'react-router-dom';
// import logo from "../../assets/logo.jpg"
// const myNavbar = ({ handleLogout }) => {
//     return (
//         <>
//             <Navbar expand="lg" className="bg-body-tertiary">
//                 <Container fluid>
//                     <Navbar.Brand href="#" className='fs-2 fw-bold ms-auto navbar-color '>
//                         <img src={logo} alt="Company Logo" className='rounded-5' width={135} height={50} />
//                     </Navbar.Brand>
//                     <Navbar.Toggle aria-controls="navbarScroll" />
//                     <Navbar.Collapse id="navbarScroll">
//                         <Nav
//                             className="ms-auto my-2 my-lg-0"
//                             style={{ maxHeight: '100px' }}
//                             navbarScroll
//                         >
//                             <Nav.Link as={Link} to="/home">Home</Nav.Link>
//                             <Nav.Link as={Link} to="/mens">MEN's</Nav.Link>
//                             <Nav.Link as={Link} to="/womens">WOMEN's</Nav.Link>
//                             <Nav.Link as={Link} to="/kids">KID's</Nav.Link>
//                             <Nav.Link as={Link} to="/cosmetics">COSMETICS</Nav.Link>
//                             <Nav.Link as={Link} to="/accessories">ACCESSORIES</Nav.Link>

//                             <Nav.Link as={Link} to="#action2"><i className="fa-solid fa-magnifying-glass"></i></Nav.Link>
//                             <Nav.Link as={Link} to="/cart"><i className="fa-solid fa-cart-shopping"></i></Nav.Link>
//                             <Nav.Link as={Link} to="/"><i class="fa-regular fa-user"></i></Nav.Link>
//                             {/* <i class="fa-solid fa-magnifying-glass"></i> */}
//                             {userId ? (
//                                 <>
//                                     <Link to="/cart">Cart</Link>
//                                     <button onClick={handleLogout}>Logout</button>
//                                 </>
//                             ) : (
//                                 <>
//                                     <Link to="/login">Login</Link>
//                                     <Link to="/">Register</Link>
//                                 </>
//                             )}
//                         </Nav>

//                     </Navbar.Collapse>
//                 </Container>
//             </Navbar>




//         </>
//     )
// }

// export default myNavbar
import React from 'react';
import { Link } from 'react-router-dom';
import logo from "../../assets/logo.jpg";
import { Navbar, Nav, Container } from 'react-bootstrap';


const myNavbar = ({ handleLogout, userId }) => {
  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container fluid>
        <Navbar.Brand href="#" className="fs-2 fw-bold ms-auto navbar-color">
          <img src={logo} alt="Company Logo" className="rounded-5" width={135} height={50} />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav className="ms-auto my-2 my-lg-0" style={{ maxHeight: '100px' }} navbarScroll>
            <Nav.Link as={Link} to="/home">Home</Nav.Link>
            <Nav.Link as={Link} to="/mens">MEN's</Nav.Link>
            <Nav.Link as={Link} to="/womens">WOMEN's</Nav.Link>
            <Nav.Link as={Link} to="/kids">KID's</Nav.Link>
            <Nav.Link as={Link} to="/cosmetics">COSMETICS</Nav.Link>
            <Nav.Link as={Link} to="/accessories">ACCESSORIES</Nav.Link>
            <Nav.Link as={Link} to="/cart"><i className="fa-solid fa-cart-shopping"></i></Nav.Link>
            <Nav.Link as={Link} to="/"><i className="fa-regular fa-user"></i></Nav.Link>

            {userId ? (
              <>
                <Link to="/cart">Cart</Link>
                <button onClick={handleLogout}>Logout</button>
              </>
            ) : (
              <>
                <Link to="/login">Login</Link>
                <Link to="/">Register</Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default myNavbar;
